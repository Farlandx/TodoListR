class TodoAPI {
    constructor(apiUrl, httpMethod, data, callback) {
        this.apiUrl = apiUrl;
        this.httpMethod = httpMethod;
        this.data = data;
        this.callback = callback;
    }

    SendAjax() {
        let xhr = new XMLHttpRequest();
        xhr.open(this.httpMethod, this.apiUrl, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                const result = JSON.parse(xhr.responseText);
                if (this.callback) {
                    this.callback(result);
                }
            }
        }.bind(this);
        xhr.send(this.data);
    }

    SendPromise() {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(this.httpMethod, this.apiUrl, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    const result = JSON.parse(xhr.responseText);
                    resolve(result);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send(this.data);
        });
    }
}


class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            todoTitle: props.children.toString(),
            isDone: props.IsDone
        };
        this.handleTodoOnChange = this.handleTodoOnChange.bind(this);
        this.handleTodoDelete = this.handleTodoDelete.bind(this);
        this.handleInputKeyUp = this.handleInputKeyUp.bind(this);
        this.objectOnChanged = this.objectOnChanged.bind(this);
        this.handleTitleOnFocus = this.handleTitleOnFocus.bind(this);
        this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    }

    //加入Key屬性後就不需要做componentWillReceiveProps
    //componentWillReceiveProps(nextProps) {
    //    this.state = {
    //        id: nextProps.id,
    //        todoTitle: nextProps.children.toString(),
    //        isDone: nextProps.IsDone
    //    };
    //}

    objectOnChanged(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleTodoOnChange(event) {
        var data = this.state;
        data.isDone = event.target.checked;
        this.event = event;
        this.props.todoItemOnChange(data, this.objectOnChanged);
    }

    handleTodoDelete(event) {
        this.props.crossMarkOnClick();
    }

    handleTitleOnFocus(event) {
        this.tmpText = event.target.value;
    }

    handleInputOnBlur(event) {
        this.setState({ todoTitle: this.tmpText });
    }

    handleInputKeyUp(event) {
        const value = event.target.value;
        //enter
        if (event.keyCode === 13 && value.length > 0) {
            //如果數值沒變就不call API
            if (value === this.tmpText) {
                event.target.blur();
                return;
            }
            var data = this.state;
            data.todoTitle = value;
            this.props.todoItemOnChange(data, ((target, value) => {
                this.tmpText = value;
                target.blur();
            }).bind(this, event.target, value));
        }
        //escape
        else if (event.keyCode === 27) {
            event.target.blur();
        }
    }

    render() {
        return (
            <li className="todoItem">
                <input className="todoIsDone" name="isDone" type="checkbox" checked={this.state.isDone} onChange={this.handleTodoOnChange} />
                <input className="todoTitle" name="todoTitle" type="text" value={this.state.todoTitle} onKeyUp={this.handleInputKeyUp} onChange={this.objectOnChanged} onFocus={this.handleTitleOnFocus} onBlur={this.handleInputOnBlur} />
                <span className="todoDelete" onClick={this.handleTodoDelete}>&#x274c;</span>
            </li>
        );
    };
};

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.crossMarkOnClick = this.crossMarkOnClick.bind(this);
    }

    crossMarkOnClick(todo) {
        const api = new TodoAPI(this.props.apiUrl, 'delete', todo.id, null);
        api.SendPromise().then(result => {
            if (result) {
                this.props.onDelete(todo);
            }
        });
    }

    render() {
        const apiUrl = this.props.apiUrl;
        var todoNodes = this.props.data.map(function (todo) {
            return (
                /* key屬性是為了讓React操作動態物件時，可以明確知道對像
                 * 這裡如果不加的話做刪除時，redraw會看到最後一筆刪掉，而實際上目標是有被正確刪除的
                 */
                <TodoItem key={todo.id} id={todo.id} IsDone={todo.isDone}
                    crossMarkOnClick={() => {
                        this.crossMarkOnClick(todo);
                    }}
                    todoItemOnChange={(value, callback) => {
                        const data = JSON.stringify(value);
                        const api = new TodoAPI(apiUrl, 'put', data, null);

                        api.SendPromise().then(result => {
                            if (result && callback) {
                                callback(event);
                            }
                        });
                    }}>
                    {todo.todoTitle}
                </TodoItem>
            );
        }, this);
        return (
            <ul className="todo">
                {todoNodes}
            </ul>
        );
    };
};


class NewTodo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { id: null, todoTitle: '', isDone: false };
        this.handleDataChange = this.handleDataChange.bind(this);
        this.handleSendClick = this.handleSendClick.bind(this);
        this.handleClearClick = this.handleClearClick.bind(this);
        this.handleInputKeyUp = this.handleInputKeyUp.bind(this);
    }

    initState() {
        this.setState({ id: null, todoTitle: '', isDone: false });
    }

    componentDidUpdate() {
    }

    onSent(value) {
        if (value.success) {
            this.props.onSent(value.data);
            this.initState();
        }
    }

    sendData() {
        if (this.state.todoTitle.length === 0) {
            return;
        }
        const api = new TodoAPI(this.props.apiUrl, 'post', JSON.stringify(this.state), this.onSent.bind(this));
        api.SendAjax();
    }

    handleDataChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSendClick() {
        this.sendData();
    }

    handleClearClick() {
        this.initState();
    }

    handleInputKeyUp(event) {
        //enter
        if (event.keyCode === 13) {
            this.sendData();
        }
    }

    render() {
        return (
            <div className="newTodo">
                <input type="checkbox" name="isDone" checked={this.state.isDone} onChange={this.handleDataChange} />
                <input type="text" placeholder="請輸入待辦事項" className="todoTitle" name="todoTitle" value={this.state.todoTitle} onChange={this.handleDataChange} onKeyUp={this.handleInputKeyUp} />
                <div className="newTodoBottom">
                    <button onClick={this.handleSendClick}>送出</button>
                    <button onClick={this.handleClearClick}>清除</button>
                </div>
            </div>
        );
    }
}


class TodoBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
        this.onTodoAdded = this.onTodoAdded.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    initData(data) {
        this.setState({ data: data });
    }

    loadTodoFromServer() {
        const api = new TodoAPI(this.props.apiGetListUrl, 'get', null, this.initData.bind(this));
        api.SendAjax();
    }

    componentDidMount() {
        this.loadTodoFromServer();
    }

    onTodoAdded(todo) {
        this.state.data.push(todo);
        this.setState(this.state);
    }

    onDelete(todo) {
        const index = this.state.data.indexOf(todo);
        if (index > -1) {
            this.state.data.splice(index, 1);
            this.setState(this.state);
        }
    }

    render() {
        return (
            <div className="todoApp">
                <h1 className="todoTitle">Todo List</h1>
                <Todo apiUrl={this.props.apiUrl} data={this.state.data} onDelete={this.onDelete} />
                <NewTodo apiUrl={this.props.apiUrl} onSent={this.onTodoAdded} />
            </div>
        );
    }
};

ReactDOM.render(
    <TodoBox apiGetListUrl="/api/Todos" apiUrl="/api/Todo" />,
    document.getElementById('content')
);