/* global notify */
import React from 'react';
import PropTypes from 'prop-types';
import { Col, Modal, Button } from 'react-bootstrap';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/textmate';
import Vega from 'react-vega';

import { t } from '../../locales';

const propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool,
  data: PropTypes.array,
};
const defaultProps = {
  show: false,
  data: [],
  onHide: () => {},
};

class PlayGroundModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderGraph = this.renderGraph.bind(this);
    this.handleMarkdownChange = this.handleMarkdownChange.bind(this);
    this.state = {
      vegaSpec: '{}',
      vegaSpecToBeRendered: null,
    };
  }

  handleMarkdownChange(nextValue) {
    this.setState({
      vegaSpec: nextValue,
    });
  }

  renderGraph() {
    const { vegaSpec } = this.state;
    this.setState({
      vegaSpecToBeRendered: {
        ...JSON.parse(vegaSpec),
      },
    });
  }

  render() {
    const { vegaSpecToBeRendered, vegaSpec } = this.state;
    const { data } = this.props;
    let specObject;
    try {
        specObject = JSON.parse(vegaSpec);
        if (specObject.data) {
          specObject.data.unshift({
            name: 'table',
            values: data,
          });
        } else {
          specObject.data = {
            name: 'table',
            values: data,
          };
        }
    } catch (e) {
        specObject = null;
    }

    return (
      <div>
        <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="playground-modal">
          <Modal.Header closeButton>
            <Modal.Title>{t('PlayGround')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Col md={6}>
                <AceEditor
                  mode="javascript"
                  theme="textmate"
                  width="100%"
                  height="90%"
                  editorProps={{ $blockScrolling: true }}
                  readOnly={false}
                  value={vegaSpec}
                  onChange={this.handleMarkdownChange}
                />
                <Button onClick={this.renderGraph}>
                  Render
                </Button>
              </Col>
              <Col md={6}>
                {specObject && data && (
                  <div style={{ width: '100%', height: '100%' }} >
                    <Vega
                      spec={specObject}
                    />
                  </div>
                )}
              </Col>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
PlayGroundModal.propTypes = propTypes;
PlayGroundModal.defaultProps = defaultProps;

export default PlayGroundModal;
