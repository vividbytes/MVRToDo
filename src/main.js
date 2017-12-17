import { MVR, MVRDom } from 'minimum-viable-react';
import ToDoApp from './ToDoApp';

window.ToDoApp = (container) => {
    MVRDom.render(MVR.createElement(ToDoApp), container);
};
