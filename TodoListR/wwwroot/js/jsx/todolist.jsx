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
        this.handleIsDoneChange = this.handleIsDoneChange.bind(this);
        this.handleTodoDelete = this.handleTodoDelete.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.state = {
            id: nextProps.id,
            todoTitle: nextProps.children.toString(),
            isDone: nextProps.IsDone
        };
    }


    isDoneChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleIsDoneChange(event) {
        var data = this.state;
        data.isDone = event.target.checked;
        this.event = event;
        this.props.checkboxOnClick(data, this.isDoneChange.bind(this));
    }

    handleTodoDelete(event) {
        this.props.crossMarkOnClick();
    }

    render() {
        return (
            <li className="todoItem">
                <label>
                    <input className="todoIsDoneo" name="isDone" type="checkbox" checked={this.state.isDone} onChange={this.handleIsDoneChange} />
                    <span className="todoTitle">{this.state.todoTitle}</span>
                </label>
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
                <TodoItem id={todo.id} IsDone={todo.isDone}
                    crossMarkOnClick={() => {
                        this.crossMarkOnClick(todo);
                    }}
                    checkboxOnClick={(value, callback) => {
                        const data = JSON.stringify(value);
                        const api = new TodoAPI(apiUrl, 'put', data, null);

                        api.SendPromise().then(result => {
                            if (result) {
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
                <input type="text" placeholder="請輸入待辦事項" name="todoTitle" value={this.state.todoTitle} onChange={this.handleDataChange} onKeyUp={this.handleInputKeyUp} />
                <input type="checkbox" name="isDone" checked={this.state.isDone} onChange={this.handleDataChange} />
                <button onClick={this.handleSendClick}>送出</button>
                <button onClick={this.handleClearClick}>Clear</button>
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
                <h1>Todo List</h1>
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