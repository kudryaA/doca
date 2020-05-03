import React from 'react';
import {
  EuiPage,
  EuiPageHeader,
  EuiTitle,
  EuiPageBody,
  EuiPageContent,
  EuiTextArea,
  EuiPageContentBody,
  EuiButton,
  EuiFilePicker
} from '@elastic/eui';

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.params = {};
  }

  render() {
    const { title } = this.props;
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiTitle size="l">
              <h1>Upload file</h1>
            </EuiTitle>
          </EuiPageHeader>
          <EuiPageContent>
            <EuiPageContentBody>
              <EuiTextArea
                placeholder='Information about document'
                onChange={text => {
                  this.params.about = text.target.value;
                }
                }
              />
              <br></br>
              <br></br>
              <EuiFilePicker
                id='id'
                multiple
                initialPromptText="content that appears in the dropzone if no file is attached"
                onChange={files => {
                  if (files.length == 1) {
                    const file = files[0];
                    if (file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                      this.params.file = file;
                      this.params.name = file.name;
                    }
                  }
                }
                }
              />
              <br></br>
              <br></br>
              <br></br>
              <EuiButton
                fill
                onClick={() => {
                  console.log(this.params);
                  if (this.params.file && this.params.about) {
                    const { httpClient } = this.props;
                    const formData = new FormData();
                    formData.append('file', this.params.file);
                    formData.append('name', this.params.name);
                    formData.append('about', this.params.about);
                    fetch('../api/upload_file/upload', {
                      method: 'POST',
                      body: formData,
                      headers: {
                        'kbn-xsrf': 'xxx'
                      }
                    });
                    /*fetch('http://192.168.0.103:6001/storage/file?password=skhgdkhethwekdbdsgbbdg', {
                      method: 'POST',
                      body: formData
                    }, (resp => {
                      console.log(resp);
                    }));*/
                  }
                }}>
                Upload
            </EuiButton>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}
