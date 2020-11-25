import React from 'react';
import axios from "axios"
import Joke from "./Joke"

class ClassBasedJokeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { jokes: []};
        this.generateNewJokes = this.generateNewJokes.bind(this)
        this.vote = this.vote.bind(this)
    }

    addJoke = (j) => {
        this.setState({ jokes: j})
    }

    async getJokes() {
        let j = [...this.state.jokes]
        let seenJokes = new Set();
        try {
            while (j.length < this.props.numJokesToGet) {
                let res = await axios.get("https://icanhazdadjoke.com", {
                    headers: { Accept: "application/json" }
                });

                let { status, ...jokeObj } = res.data

                if (!seenJokes.has(jokeObj.id)) {
                    seenJokes.add(jokeObj.id);
                    j.push({ ...jokeObj, votes: 0 });
                } else {
                    console.error('duplicate found!');
                }
            }
            this.addJoke(j);
        } catch (e) {
            console.log(e)
        }
    }

    async componentDidMount() {
        if (this.state.jokes.length < 10) this.getJokes();
    }

    async componentDidUpdate() {
        if (this.state.jokes.length < 10) this.getJokes();
    }

    generateNewJokes() {
        this.setState({jokes: []})
    }

    vote(id, delta) {
        this.setState(allJokes => allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta }: j))
        );
    }

    

    render() {
        if (this.state.jokes.length) {
            let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

            return (
                <div className="JokeList">
                    <button className="JokeList-getmore" onClick={this.generateNewJokes}>
                    Get New Jokes
                    </button>

                    {sortedJokes.map(j => (
                        <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
                    ))}
                </div>

        )} else {
            return null
        }
    }
}

ClassBasedJokeList.defaultProps = {
    numJokesToGet: 10
}

export default ClassBasedJokeList;