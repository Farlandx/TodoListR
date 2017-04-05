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

class TodoBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    loadTodoFromServer() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.apiUrl, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        }.bind(this);
        xhr.send();
    }

    componentDidMount() {
        this.loadTodoFromServer();
    }

    render() {
        return (
            <div className="todoBox">
                <h1>待辦事項</h1>
                <Todo data={this.state.data} />
            </div>
        );
    }
};

ReactDOM.render(
    <TodoBox apiUrl="/api/Todos" />,
    document.getElementById('content')
);