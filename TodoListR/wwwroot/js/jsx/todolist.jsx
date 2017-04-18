var data = [
    { id: 1, todoTitle: "起床", isDone: true },
    { id: 2, todoTitle: "刷牙洗臉", isDone: false },
    { id: 3, todoTitle: "上班去", isDone: false }
];

class TodoAPI {
    constructor(apiUrl, httpMethod, data, callback) {
        this.apiUrl = apiUrl;
        this.httpMethod = httpMethod;
        this.data = data;
        this.callback = callback;
    }

    SendAjax() {
        var xhr = new XMLHttpRequest();
        xhr.open(this.httpMethod, this.apiUrl, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onload = function () {
            var result = JSON.parse(xhr.responseText);
            this.callback(result);
        }.bind(this);
        xhr.send(this.data);
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
        this.props.checkboxOnClick(data, this.isDoneChange, event);
    }

    render() {
        return (
            <li className="todoItem">
                <label>
                    <input className="todoIsDoneo" name="isDone" type="checkbox" checked={this.state.isDone} onChange={this.handleIsDoneChange} />
                    <span className="todoTitle">{this.state.todoTitle}</span>
                </label>
            </li>
        );
    };
};

class Todo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var apiUrl = this.props.apiUrl;
        var todoNodes = this.props.data.map(function (todo) {
            return (
                <TodoItem id={todo.id} IsDone={todo.isDone} checkboxOnClick={(value, callback, event) => {
                    var data = JSON.stringify(value);
                    var e = event;
                    var api = new TodoAPI(apiUrl, 'put', data, (result, event) => {
                        if (result) {
                            // #Todo: 還沒完成
                            callback(this.data);
                        }
                        else {
                            console.log('Error');
                        }
                    });
                    var result = api.SendAjax();
                }}>
                    {todo.todoTitle}
                </TodoItem>
            );
        });
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
        var api = new TodoAPI(this.props.apiUrl, 'post', JSON.stringify(this.state), this.onSent.bind(this));
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
    };

    render() {
        return (
            <div className="newTodo">
                <input type="text" placeholder="請輸入待辦事項" name="todoTitle" value={this.state.todoTitle} onChange={this.handleDataChange} />
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
    }

    initData(data) {
        this.setState({ data: data });
    }

    loadTodoFromServer() {
        var api = new TodoAPI(this.props.apiGetListUrl, 'get', null, this.initData.bind(this));
        api.SendAjax();
    }

    componentDidMount() {
        this.loadTodoFromServer();
    }

    onTodoAdded(todo) {
        this.state.data.push(todo);
        this.setState(this.state);
    }

    render() {
        return (
            <div className="todoApp">
                <h1>待辦事項</h1>
                <Todo apiUrl={this.props.apiUrl} data={this.state.data} />
                <NewTodo apiUrl={this.props.apiUrl} onSent={this.onTodoAdded} />
            </div>
        );
    }
};

ReactDOM.render(
    <TodoBox apiGetListUrl="/api/Todos" apiUrl="/api/Todo" />,
    document.getElementById('content')
);