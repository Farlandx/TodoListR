var data = [
    { id: 1, todoTitle: "起床", isDone: true },
    { id: 2, todoTitle: "刷牙洗臉", isDone: false },
    { id: 3, todoTitle: "上班去", isDone: false }
];

class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            text: props.children.toString(),
            isDone: props.IsDone ? 'checked' : ''
        };

        this.handleIsDoneChange = this.handleIsDoneChange.bind(this);
    }

    handleIsDoneChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <li className="todoItem">
                <label>
                    <input className="todoIsDoneo" name="isDone" type="checkbox" checked={this.state.isDone} onChange={this.handleIsDoneChange} />
                    <span className="todoid">{this.state.id}</span>
                    <span className="todoTitle">{this.state.text}</span>
                </label>
            </li>
        );
    };
};

class Todo extends React.Component {
    render() {
        var todoNodes = this.props.data.map(function (todo) {
            return (
                <TodoItem id={todo.id} IsDone={todo.isDone}>
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
    }

    componentDidUpdate() {
    }

    onSent(todo) {
        this.props.onSent(todo);
        this.setState({ id: null, todoTitle: '', isDone: false });
    }

    sendData() {
        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.apiUrl, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onload = function () {
            var result = JSON.parse(xhr.responseText);
            if (result.success) {
                this.onSent(result.data);
            }
        }.bind(this);
        xhr.send(JSON.stringify(this.state));
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

    render() {
        return (
            <div className="newTodo">
                <input type="text" placeholder="請輸入待辦事項" name="todoTitle" onChange={this.handleDataChange} />
                <input type="checkbox" name="isDone" onChange={this.handleDataChange} />
                <button onClick={this.handleSendClick}>送出</button>
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

    loadTodoFromServer() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.apiGetListUrl, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        }.bind(this);
        xhr.send();
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
                <Todo data={this.state.data} />
                <NewTodo apiUrl={this.props.apiUrl} onSent={this.onTodoAdded} />
            </div>
        );
    }
};

ReactDOM.render(
    <TodoBox apiGetListUrl="/api/Todos" apiUrl="/api/Todo" />,
    document.getElementById('content')
);