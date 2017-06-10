# InvoiceKuGa

The purpose of the application is to create invoices and it is possible to administer customers and customer contacts.
Furthermore, the application supports the generation of statistics and charts to analyse the revenues.

## Installation

Node.js needs to be installed to run the application. [Install Node.js here.](https://nodejs.org/en/download/)
After the installation has completed, run the following command:

```
npm initialize
```

This command installs all dependencies of the application

## Start Application

In order to start the application go to the root folder of the application and run the following command:

```
node express.js
```

The application now listens on port `8080`.

![application is ready](img_readme/server_execute.png)

## Debug Node.js Backend

Debugging is an integral part of the development process. For debugging a `Node.js` application it is recommended to use
the `Node Inspector` which can be installed by executing the following commad in the terminal:

```
npm install -g node-inspector
```

This installs the `Node Inspector` globally. The debugger can be started like this:

```
node-debug express.js
```

After that the debugger listens on port `5858` on your local machine.
(The browser should open automatically.)

![node inspector](img_readme/node_inspector.png)
