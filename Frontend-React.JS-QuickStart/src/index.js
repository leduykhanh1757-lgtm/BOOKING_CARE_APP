import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';

import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";


import { Provider } from 'react-redux';
import reduxStore, { persistor } from './redux';

// ============================================================
// FIX: Google Translate (hoặc bất kỳ extension/tool nào tự ý
// chỉnh sửa DOM ngoài tầm kiểm soát của React) gây lỗi:
// "NotFoundError: Failed to execute 'removeChild' on 'Node':
//  The node to be removed is not a child of this node."
//
// Nguyên nhân: Google Translate tự thay thế/di dời text node
// trong DOM. Khi React re-render và cố gọi removeChild/insertBefore
// trên node đã bị Google di dời, DOM native API sẽ throw lỗi vì
// node đó không còn là con thật sự của parent nữa.
//
// Cách xử lý: "vá" (patch) lại 2 hàm gốc của DOM để nếu phát hiện
// node không còn là con của parent thì bỏ qua thay vì crash toàn app.
// ============================================================
if (typeof Node === 'function' && Node.prototype) {
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function (child) {
        if (child.parentNode !== this) {
            if (console) {
                console.warn('Cannot remove a child from a different parent', child, this);
            }
            return child;
        }
        return originalRemoveChild.apply(this, arguments);
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, referenceNode) {
        if (referenceNode && referenceNode.parentNode !== this) {
            if (console) {
                console.warn('Cannot insert before a reference node from a different parent', referenceNode, this);
            }
            return newNode;
        }
        return originalInsertBefore.apply(this, arguments);
    };
}
// ============================================================

const renderApp = () => {
    ReactDOM.render(
        <Provider store={reduxStore}>
            <IntlProviderWrapper>
                <App persistor={persistor} />
            </IntlProviderWrapper>
        </Provider>,
        document.getElementById('root')
    );
};

renderApp();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();