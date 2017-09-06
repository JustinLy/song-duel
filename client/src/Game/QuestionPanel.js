import React, { Component } from 'react';
import Container from 'muicss/lib/react/container';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import '../GameRoom.css';
import SongButton from './SongButton.js';

class QuestionPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let containerStyle = {
            width: "60vh",
            height: "50vh"
        };

        if (this.props.question) {
            return (
                <Container fluid={true} style={containerStyle} className="QuestionPanel">
                    <Row className="first-row-buttons">
                        <Col md="5">
                            <SongButton
                                enabled={this.props.canAnswer}
                                song={this.props.question.songOptions[0]}
                                onAnswer={this.props.onAnswer}
                            />
                        </Col>

                        <Col md="5" md-offset="2">
                            <SongButton
                                enabled={this.props.canAnswer}
                                song={this.props.question.songOptions[1]}
                                onAnswer={this.props.onAnswer}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md="5">
                            <SongButton
                                enabled={this.props.canAnswer}
                                song={this.props.question.songOptions[2]}
                                onAnswer={this.props.onAnswer}
                            />
                        </Col>

                        <Col md="5" md-offset="2">
                            <SongButton
                                enabled={this.props.canAnswer}
                                song={this.props.question.songOptions[3]}
                                onAnswer={this.props.onAnswer}
                            />
                        </Col>
                    </Row>
                </Container>
            )
        } else {
            return (
                <Container fluid={true} style={containerStyle} className="QuestionPanel">

                </Container>
            )
        }

    }
}

export default QuestionPanel;