 import React, {Component, createContext, lazy, Suspense, PureComponent, memo} from 'react';
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
export default App2; // pureComponent and memo