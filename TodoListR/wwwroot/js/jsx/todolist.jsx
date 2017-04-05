var data = [
    { ID: 1, TodoTitle: "起床", IsDone: true },
    { ID: 2, TodoTitle: "刷牙洗臉", IsDone: false },
    { ID: 3, TodoTitle: "上班去", IsDone: false }
];

class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.ID,
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
            <li className="todo">
                <label>
                    <input className="todoIsDoneo" name="isDone" type="checkbox" checked={this.state.isDone} onChange={this.handleIsDoneChange} />
                    <span className="todoID">{this.state.id}</span>
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
                <TodoItem ID={todo.ID} IsDone={todo.IsDone}>
                    {todo.TodoTitle}
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
    render() {
        return (
            <div className="todoBox">
                <h1>待辦事項</h1>
                <Todo data={this.props.data} />
            </div>
        );
    }
};

ReactDOM.render(
    <TodoBox data={data} />,
    document.getElementById('content')
);