const fs = require("fs");
const path = require("path");

// Используем commander для определения параметров
const program = require("commander");

program
  .option("-s, --styles", "Create styles file component.scss")
  .parse(process.argv);

// Имя компонента будет первым неопределенным аргументом
const componentName =
  capitalizeFirstLetter(program.args[0]) || "DefaultComponent";

const componentDirectory = path.join("src", "components");

// Создаем директорию для компонента, если ее нет
if (!fs.existsSync(componentDirectory)) {
  fs.mkdirSync(componentDirectory);
}

// Создаем файл component.jsx
const componentContent = `import React from 'react'

const ${componentName} = () => {
  return (
    <div>component: ${componentName}</div>
  )
}

export default ${componentName}`;

const componentFilePath = path.join(componentDirectory, `${componentName}.jsx`);
fs.writeFileSync(componentFilePath, componentContent);

// Если указан аргумент -s, создаем файл component.scss
if (program.styles || program.rawArgs.includes("-s")) {
  const scssContent = `.${componentName.toLowerCase()} {
    
}`;
  const scssFilePath = path.join("src", "scss", `${componentName}.scss`);
  fs.writeFileSync(scssFilePath, scssContent);

  // Импортируем компонент в style.scss
  const styleFilePath = path.join("src", "scss", "base", "style.scss");
  const importStatement = `@import './${componentName}.scss';\n`;

  if (!fs.readFileSync(styleFilePath, "utf-8").includes(importStatement)) {
    fs.appendFileSync(styleFilePath, importStatement);
    console.log(
      `Style import for component '${componentName}' added to style.scss.`
    );
  }
}

console.log(`Component '${componentName}' created successfully.`);

function capitalizeFirstLetter(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}
