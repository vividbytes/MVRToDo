import { MVR } from 'minimum-viable-react';

class ToDoItem extends MVR.Component {

    constructor(props) {
        super(props);

        this.state = {
            inEditMode: false
        };
    }

    componentDidUpdate() {
        if (this.input) {
            this.input.focus();
        }
    }

    goToEditMode() {
        this.setState({
            inEditMode: true
        });
    }

    leaveEditMode() {
        this.setState({
            inEditMode: false
        });
    }


    render() {
        return MVR.createElement('div', {
            class: 'todo'
        },
            this.state.inEditMode ?
            [
                MVR.createElement('input', {
                    class: 'edit',
                    ref: (input) => {
                        if (input) {
                            this.input = input;
                        }
                    },
                    onKeyDown: (e) => {
                        if (e.which === 13) {
                            this.input.blur();
                        }
                    },
                    onBlur: (e) => {
                        const text = e.target.value;
                        if (!text.length) {
                            this.props.onDestroy(e);
                        } else {
                            this.props.onEdit(e.target.value);
                            this.leaveEditMode();
                        }
                    },
                    value: this.props.text
                })
            ] : [

                MVR.createElement('div', { class: 'view' }, [

                    MVR.createElement('input', {
                        onChange: (e) => {
                            e.preventDefault();
                            this.props.onClick(e.target.checked);
                        },
                        type: 'checkbox',
                        class: 'toggle',
                        checked: this.props.completed
                    }),
                    MVR.createElement('label', {
                        onDblClick: this.props.completed ? () => {} : this.goToEditMode.bind(this),
                        class: `text ${this.props.completed ? 'completed' : ''}`
                    }, [
                        this.props.text
                    ]),
                    MVR.createElement('button', {
                        class: 'destroy',
                        onClick: this.props.onDestroy
                    })
                ])

            ]
        );
    }

}

class Input extends MVR.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };
    }

    render() {
        return MVR.createElement('header', {
            class: 'header'
        }, [
            this.props.showToggle ?
                MVR.createElement('input', {
                    name: 'toggle-all',
                    class: 'toggle-all',
                    type: 'checkbox',
                    onChange: (e) => { this.props.onToggleAll(e.target.checked); },
                    checked: this.props.allCompleted
                })
                :
                null,
            MVR.createElement('form', {
                class: 'new-todo',
                onSubmit: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.state.value) {
                        const value = this.state.value;
                        this.setState({ value: '' });
                        this.props.onClick(value);
                        this.input.focus();
                    }
                }
            }, [
                MVR.createElement('input', {
                    class: 'text-input',
                    ref: (input) => {
                        if (input) {
                            this.input = input;
                        }
                    },
                    onChange: (e) => {
                        this.setState({ value: e.target.value });
                    },
                    placeholder: 'What needs to be done?',
                    value: this.state.value
                }),
                MVR.createElement('input', {
                    class: 'submit',
                    type: 'submit'
                })
            ])
        ]);
    }

}

export default class ToDoApp extends MVR.Component {

    constructor(props) {
        super(props);

        this.state = {
            filter: 'all',
            todos: []
        };

        this.filters = {
            all: todo => todo,
            active: todo => !todo.completed,
            completed: todo => todo.completed
        };
    }


    deleteCompleted() {
        this.setState({
            todos: this.state.todos.filter(todo => !todo.completed)
        });
    }

    deleteTodo(deletedTodo) {
        this.setState({
            todos: this.state.todos.filter(todo => todo.id !== deletedTodo.id)
        });
    }

    completeTodo(completedTodo, value) {
        this.setState({
            todos: this.state.todos.map((todo) => {
                if (completedTodo.id !== todo.id) return todo;

                return Object.assign({}, todo, {
                    completed: value
                });
            })
        });
    }

    addTodo(text) {
        this.setState({
            todos: this.state.todos.concat([
                {
                    text,
                    id: Math.random().toString(),
                    completed: false
                }
            ])
        });
    }

    editTodo(editedTodo, newText) {
        this.setState({
            todos: this.state.todos.map((todo) => {
                if (editedTodo.id !== todo.id) return todo;

                return Object.assign({}, todo, {
                    text: newText
                });
            })
        });
    }

    numOfUnCompleted() {
        return this.state.todos.filter(todo => !todo.completed).length;
    }

    toggleAll(value) {
        this.setState({
            todos: this.state.todos.map(todo =>
                Object.assign({}, todo, {
                    completed: value
                })
            )
        });
    }

    render() {
        const numOfUnCompleted = this.numOfUnCompleted();
        return MVR.createElement('div', {
            class: 'container'
        }, [
            MVR.createElement('section', {
                class: 'todoapp'
            }, [
                MVR.createElement(Input, {
                    onClick: this.addTodo.bind(this),
                    onToggleAll: this.toggleAll.bind(this),
                    allCompleted: numOfUnCompleted === 0,
                    showToggle: this.state.todos.length > 0
                }),
                MVR.createElement('ul', {
                    class: 'todo-list'
                }, [
                    this.state.todos
                    .filter(this.filters[this.state.filter])
                    .map(todo =>
                        MVR.createElement('li', {
                            key: todo.id
                        },
                            [
                                MVR.createElement(ToDoItem, Object.assign({
                                    onClick: (value) => { this.completeTodo(todo, value); },
                                    onEdit: (newValue) => {
                                        this.editTodo(todo, newValue);
                                    },
                                    onDestroy: () => {
                                        this.deleteTodo(todo);
                                    }
                                }, todo))
                            ])
                    )
                ]),
                this.state.todos.length < 1 ?
                    null :
                    MVR.createElement('footer', {
                        class: 'footer'
                    }, [
                        MVR.createElement('span', {
                            class: 'todo-count'
                        }, [
                            `${numOfUnCompleted} item${numOfUnCompleted === 1 ? '' : 's'} left`
                        ]),
                        MVR.createElement('ul', {
                            class: 'filters'
                        }, [
                            Object.keys(this.filters).map(filter =>
                                MVR.createElement('li', { key: filter }, [
                                    MVR.createElement('a', {
                                        class: this.state.filter === filter ? 'selected' : null,
                                        onClick: () => {
                                            this.setState({
                                                filter
                                            });
                                        }
                                    }, [
                                        filter
                                    ])
                                ])
                            )
                        ]),
                        this.state.todos.length > this.numOfUnCompleted() ?
                            MVR.createElement('button', {
                                class: 'clear-completed',
                                onClick: this.deleteCompleted.bind(this)
                            }, [
                                'Clear completed'
                            ])
                            :
                            null
                    ])
            ])
        ]);
    }
}
