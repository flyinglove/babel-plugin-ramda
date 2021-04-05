import { addDefault } from '@babel/helper-module-imports';
import resolveModule from './modules';

const SPECIAL_TYPES = ['isMemberExpression', 'isProperty'];

function isSpecialTypes(t, node) {
    return SPECIAL_TYPES.filter(type => t[type](node)).length > 0;
}

export default function({ types: t }) {
  // Tracking variables build during the AST pass. We instantiate
  // these in the `Program` visitor in order to support running the
  // plugin in watch mode or on multiple files.
  let ramdas,
      removablePaths,
      specified,
      selectedMethods;

  // Import a ramda method and return the computed import identifier
  function importMethod(useES, methodName, file) {
    if (!selectedMethods[methodName]) {
      // 从相关目录中寻找方法的path
      let path = resolveModule(useES, methodName);
      selectedMethods[methodName] = addDefault(file.path, path, { nameHint: methodName });
    }
    return t.clone(selectedMethods[methodName]);
  }
  // 当前全局存储了name作为ramda的别名， 并且这个名称在当前作用域内是import进来的
  function matchesRamda(path, name) {
    return ramdas[name] && (
      hasBindingOfType(path.scope, name, 'ImportDefaultSpecifier') ||
      hasBindingOfType(path.scope, name, 'ImportNamespaceSpecifier')
    );
  }

  // 之前从ramda中导入过同名的方法， 并且当前的这个方法是导入的
  function matchesRamdaMethod(path, name) {
    return specified[name] && hasBindingOfType(path.scope, name, 'ImportSpecifier');
  }

  // 当前scope内有同名方法， 并且这个方法是导入的，
  function hasBindingOfType(scope, name, type) {
    return scope.hasBinding(name) && scope.getBinding(name).path.type === type;
  }

  return {
    visitor: {
      Program: {
        enter() {
          // Track the variables used to import ramda
          ramdas = Object.create(null);
          removablePaths = [];
          specified = Object.create(null);
          // Track the methods that have already been used to prevent dupe imports
          selectedMethods = Object.create(null);
        },
        exit() {
          removablePaths
            .filter(path => !path.removed)
            .forEach(path => path.remove());
        }
      },
      ImportDeclaration(path) {
        let { node } = path;
        if (node.source.value === 'ramda') {
          // console.log(path)
          // throw new Error(22)
          node.specifiers.forEach(spec => {
            // 针对具名的ramda导入， 将导入的方法名称存储起来
            if (t.isImportSpecifier(spec)) {
              specified[spec.local.name] = spec.imported.name;
            } else {
              // 非具名导入， 记录导入的变量名到ramda中
              ramdas[spec.local.name] = true;
            }
          });
          // 移除当前import语句
          path.remove();
          path.replaceWith(t.nullLiteral())
          removablePaths.push(path);
        }
      },
      ExportNamedDeclaration(path, state) {
        let { node, hub } = path;
        let { useES } = state.opts;
        if (node.source && node.source.value === 'ramda') {
          let specifiers = node.specifiers.map(spec => {
            // 导入相关方法对应的文件
            let importIdentifier = importMethod(useES, spec.exported.name, hub.file);
            let exportIdentifier = t.identifier(spec.local.name);
            return t.exportSpecifier(importIdentifier, exportIdentifier);
          });
          node.specifiers = specifiers;
          node.source = null;
        }
      },
      ExportAllDeclaration(path) {
        let { node } = path;
        if (node.source && node.source.value === 'ramda') {
          throw new Error('`export * from "ramda"` defeats the purpose of babel-plugin-ramda');
        }
      },
      CallExpression(path, state) {
        let { node, hub } = path;
        let { name } = node.callee;
        let { useES } = state.opts;
        // 如果调用没有callee, 不处理， 直接返回, 异常处理
        if (!t.isIdentifier(node.callee)) return;
        // 之前从ramda中导入过同名的方法， 并且当前的这个方法是导入的
        if (matchesRamdaMethod(path, name)) {
          // 则当前的函数就直接从ramda中导入
          node.callee = importMethod(useES, specified[name], hub.file);
        }
        if (node.arguments) {
          node.arguments = node.arguments.map(arg => {
            let { name } = arg;
            return matchesRamdaMethod(path, name)
              ? importMethod(useES, specified[name], hub.file)
              : arg;
          });
        }
      },
      MemberExpression(path, state) {
        let { node } = path;
        let objectName = node.object.name;
        let { useES } = state.opts;
        if (!matchesRamda(path, objectName)) return;
        // R.foo() -> foo()
        let newNode = importMethod(useES, node.property.name, path.hub.file);
        path.replaceWith({ type: newNode.type, name: newNode.name });
      },
      Property(path,state) {
        let { node, hub } = path;
        let { useES } = state.opts;
        if (t.isIdentifier(node.key) && node.computed && matchesRamdaMethod(path, node.key.name)) {
          node.key = importMethod(useES, specified[node.key.name], hub.file);
        }
        if (t.isIdentifier(node.value) && matchesRamdaMethod(path, node.value.name)) {
          node.value = importMethod(useES, specified[node.value.name], hub.file);
        }
      },
      Identifier(path, state) {
        let { node, hub, parent, scope } = path;
        let { name } = node;
        let { useES } = state.opts;
        // 如果当前Identifier的父级不是成员访问或者是属性的话
        // 也就是说当前Identifer是直接调用
        // 此时直接替换当前节点为ramda方法调用
        if ( matchesRamdaMethod(path, name) && !isSpecialTypes(t, parent)) {
          let newNode = importMethod(useES, specified[name], hub.file);
          path.replaceWith({ type: newNode.type, name: newNode.name });
        } else if (matchesRamda(path, name)) {
          // 如果是ramda全局引入的调用， 把
          // #19, nullify direct references to the ramda import (for apply/spread/etc)
          let replacementNode = t.nullLiteral();
          path.replaceWith(replacementNode);
        }
      }
    }
  };
}
