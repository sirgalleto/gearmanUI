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
        this.setState({
          result: job.response ? job.response.toString() : '',
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
          <Text background={this.state.success ? 'green' : 'red'}>
            {this.state.result}
          </Text>
        )}
      </div>
    );
  }
}
