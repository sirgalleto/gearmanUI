// @flow
import React, { Component } from 'react';
import { TextInput, Button, Text } from 'react-desktop/macOs';
import gearman from 'gearmanode';

export default class Home extends Component {
  state = {
    result: '',
    success: false
  }
  client = null;
  jobName = '';
  payload = null;
  servers = '';
  response = '';
  subscribeWorkers() {
    const gearmanServers = [];
    this.servers.split(',').forEach(server => {
      gearmanServers.push({
        host: server.trim(),
        port: 4730
      });
    });

    this.client = gearman.client({ servers: gearmanServers });

    console.log(gearmanServers);
    console.log(this.client);
  }
  submitJob() {
    if (this.client && this.payload) {
      const job = this.client.submitJob(this.jobName, this.payload);

      console.info(`${this.jobName} submited`);

      job.on('complete', () => {
        this.response = job.response;
        this.processResponse();
        this.setState({
          result: this.response,
          success: true
        });
      });

      job.on('error', () => {
        this.setState({
          result: job.response ? job.response.toString() : '',
          success: false
        });
      });
    }
  }
  processResponse() {
    this.response = this.response.toString();

    try {
      this.response = JSON.parse(this.response);
      this.response = JSON.stringify(this.response, null, 2);
    } catch (e) {
      console.info(e);
    }
  }
  render() {
    return (
      <div>
        <TextInput
          label="Servers"
          placeholder="server,server"
          onChange={e => {
            this.servers = e.target.value;
          }}
        />

        <br />

        <Button color="blue" onClick={this.subscribeWorkers.bind(this)}>
          Use
        </Button>

        <br />
        <br />

        <TextInput
          label="job name"
          placeholder="job name"
          onChange={e => {
            this.jobName = e.target.value;
          }}
        />

        <br />

        <TextInput
          label="Payload"
          placeholder="{data: data}"
          onChange={e => {
            this.payload = e.target.value;
          }}
        />

        <br />

        <Button color="blue" onClick={this.submitJob.bind(this)}>
          Submit
        </Button>

        { this.state.result && (
          <Text background={this.state.success ? '#beffbf' : '#ffbfbe'} padding="0 100px" textAlign="center" size="16">
            {
              JSON.stringify(this.state.result)
            }
          </Text>
        )}
      </div>
    );
  }
}
