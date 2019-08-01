 import React, {Component, createContext, lazy, Suspense, PureComponent, memo, useState, useEffect, useRef, useCallback} from 'react';
import logo from './logo.svg';
import './App.css';

const BatteryContext = createContext(90) // 90 is the default value
const OnlineContext = createContext()

const About = lazy(() => import(/*webpackChunkName: "about"*/'./About.jsx'))

console.log('About', About)

 // ErrorBoundary
 // componentDidCatch

class Leaf extends Component {

    static contextType = BatteryContext

    static getDerivedStateFromError() {
        console.log('error1')
        return {
            hasError: true
        }
    }

    state = {
        renderDelay: null,
        hasError: false
    }

    componentDidMount() {
        setTimeout(( ) => {
            this.setState({
                renderDelay: 1
            }, () => {
                console.log('  ', this.state.renderDelay)
            });
        }, 2000)
    }

    componentDidCatch() {
        console.log('error2', this.state.hasError)
        this.setState({
            hasError: true
        })
    }

    render () {
        const battery = this.context
        console.log('this.state.hasError', this.state.hasError)
        if (this.state.hasError) {
            return <div> error </div>
        }
        if (1) {
            return (
                <div>
                    <h1>Battery: {battery}</h1>
                    {
                        this.state.renderDelay &&
                        <Suspense fallback={<div>loading</div>}>
                            <About></About>
                        </Suspense>
                    }
                    {/*<Suspense fallback={<div>loading</div>}>*/}
                        {/*<About></About>*/}
                    {/*</Suspense>*/}
                </div>

            )
        } else {
            return (<BatteryContext.Consumer>
                {
                    battery => <h1>Battery: {battery}</h1>
                }
                {/*{*/}
                {/*battery => (<OnlineContext.Consumer>*/}
                {/*{*/}
                {/*online => <h1>Battery: {battery}, Online: {String(online)}</h1>*/}
                {/*}*/}
                {/*</OnlineContext.Consumer>)*/}
                {/*}*/}
            </BatteryContext.Consumer>)
        }
    }
}

class Middle extends Component{
    render() {
        return <Leaf />
    }
}
class App extends Component{
    state = {
        battery: 60,
        online: false
    }
    render(){
        const { battery } = this.state
        const { online } = this.state
        console.log('battery', battery)
        if (1) {
            return (
                <BatteryContext.Provider value={battery}>
                    <OnlineContext.Provider value={online}>
                        <button type="button" onClick={() => this.setState({battery: battery-1})}>
                            Press
                        </button>
                        <button type="button" onClick={() => this.setState({online: !online})}>
                            Switch
                        </button>
                        <Middle />
                    </OnlineContext.Provider>
                </BatteryContext.Provider>
            );
        } else {
            return (
                    <OnlineContext.Provider value={online}>
                        <button type="button" onClick={() => this.setState({battery: battery-1})}>
                            Press
                        </button>
                        <button type="button" onClick={() => this.setState({online: !online})}>
                            Switch
                        </button>
                        <Middle />
                    </OnlineContext.Provider>
            );
        }
    }
}


 // class Foo extends Component {
 // class Foo extends PureComponent {
 //     // shouldComponentUpdate(nextProps, nextState) {
 //     //     if (nextProps.name === this.props.name) {
 //     //         return false
 //     //     }
 //     //     return true
 //     // }
 //     render() {
 //         console.log('Foo render')
 //         return (
 //             <div>
 //                 Foo
 //                 {this.props.person.age}
 //             </div>
 //         );
 //     }
 // }

 // function Foo(props) {
 //    console.log('Foo Render')
 //    return <div>{props.person.age}</div>
 // }

 const Foo = memo(function Foo(props) {
     console.log('Foo Render')
     return <div>{props.person.age}</div>
 })


 class App2 extends Component {
    state = {
        count: 0,
        person: {
            age: 1
        }
    }
     // callBack() {
     //    // this 指向不能保证
     // }
     callBack = () => {

     }
     render() {
         const person = this.state.person
         return (
             <div>
                {/*<button type="button" onClick={() => this.setState({count: this.state.count+1})}>Add</button>*/}
                <button type="button" onClick={() => {
                    person.age ++
                    this.setState({person})
                }}>Add</button>
                {/*<Foo name="Mike" />*/}
                {/*<Foo person={person} />*/}
                {/*<Foo person={person} cb={()=>{}} />*/}
                <Foo person={person} cb={this.callBack} />
             </div>
        );
     }
 }

// export default App;
// export default Leaf; // suspens lazy
// export default App2; // pureComponent and memo
// export default App3; // hooks
export default TodoList; // redux

 // hooks 类组件不足
 // THIS指向困扰
 // 内联函数过度创建新句柄
 // 类成员函数不能保证this

// function Bar() {
//     const size = useSize()
//     useEffect(() => {
//         document.title = size.join("x")
//     })
//
//     return (
//     <div>
//         {size.width}x{size.height}
//     </div>
//     )
// }
 let id = 0
 function App3(props) {
     console.log('props', props)
     const defaultCount = props.defaultCount || 0

     const [count, setCount] = useState(() => {
         console.log('initial count') // only once
         return props.defaultCount || 0
     })
     // const [count, setCount] = useState(0)
     const [name, setName] = useState('Mike')

     // let name, setName;
     // let count, setCount;
     //
     // id +=1
     // if (id & 1) {
     //     [count, setCount] = useState(0)
     //     [name, setName] = useState('Mike')
     // } else {
     //     [name, setName] = useState('Mike')
     //     [count, setCount] = useState(0)
     // }
     console.log('count', count)
     console.log('setCount', setCount)
     return (
         <button type="button" onClick={() => {setCount(count + 1)}}>
             Click ({count}), name ({name})
         </button>
     )
 }
 // eslint-plugin-react-hooks

 let idSeq = Date.now()
 function Control(props) {
     const inputRef = useRef()
     const { addTodo } = props
     const onSubmit = (e) => {
         e.preventDefault()
         const newText = inputRef.current.value.trim()
         if (newText.length === 0) {
             return
         }
         addTodo({
             id: ++idSeq,
             text: newText,
             complete: false
         })
         inputRef.current.value = ''
     }
     return (
         <div className="control">
             <h1>
                 todos
             </h1>
             <form onSubmit={onSubmit}>
                 <input type="text"
                        className="new-todo"
                        placeholder="what needs to be done?"
                        ref={inputRef}
                 />
             </form>
         </div>
     )
 }
 function TodoItem(props) {
     const {
         todo: {
             id,
             text,
             complete
         },
         toggleTodo,
         removeTodo
     } = props
     const onChange = () => {
         toggleTodo(id)
     }
     const onRemove = () => {
         removeTodo(id)
     }
     return (
         <li className="todo-item">
             <input type="checkbox" onChange={onChange} checked={complete}/>
             <label htmlFor="" className={complete ? 'complete' : ''}>{text}</label>
             <button onClick={onRemove}>&#xd7;</button>
         </li>
     )
 }
 function Todos(props) {
     const { todos, toggleTodo, removeTodo } = props
     return (
         <ul>
             {
                 todos.map(todo => {
                     return (
                         <TodoItem
                            key={todo.id}
                            todo={todo}
                            toggleTodo={toggleTodo}
                            removeTodo={removeTodo}
                         >

                         </TodoItem>
                     )
                 })
             }
         </ul>
     )
 }

 const LS_KEY = '$-todos_'
 function TodoList() {
     const [todos, setTodos] = useState([])

     const addTodo = useCallback((todo) => {
         setTodos(todos => [...todos, todo])
     }, [])

     const removeTodo = useCallback((id) => {
         setTodos(todos => todos.filter(todo => {
             return todo.id !== id
         }))
     }, [])

     const toggleTodo = useCallback((id) => {
         setTodos(todos => todos.map(todo => {
             return todo.id === id
             ? {
                 ...todo,
                 complete: !todo.complete
             }
             : todo;
         }))
     }, [])

     useEffect(() => {
         const todos = JSON.parse(localStorage.getItem(LS_KEY)) || []
         setTodos(todos)
     }, [])
     // }, [todos]) // forever loop with storage

    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(todos))
    }, [todos])

     return(
         <div className="todo-list">
             <Control addTodo={addTodo} />
             <Todos removeTodo={removeTodo} toggleTodo={toggleTodo} todos={todos}/>
         </div>
     )
 }
 class App4 extends Component {
     render() {
         return (
             <div>
                 
             </div>
         );
     }
 }