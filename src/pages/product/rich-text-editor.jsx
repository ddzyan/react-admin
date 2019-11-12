import React, { Component } from "react";
import PropTyeps from "prop-types";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { message } from "antd";

export default class RichTextEditor extends Component {
  static propTypes = {
    detail: PropTyeps.string
  };

  constructor(props) {
    super(props);
    const { detail } = this.props;
    if (detail) {
      const contentBlock = htmlToDraft(detail);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState
        };
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty()
      };
    }
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  // 将输入的内容传递给父组件
  getDetail = () => {
    const { editorState } = this.state;

    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  };

  // 图片上传回调函数
  uploadImageCallBack = file => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/manage/img/upload");
      //xhr.setRequestHeader("Authorization", "Client-ID XXXXX");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        console.log("response :", response);
        if (response.status === 0) {
          message.success("上传成功");
          resolve({ data: { link: response.data.url } });
        } else {
          message.error("上传失败");
          reject(response.data.msg);
        }
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };

  /**
   * uploadCallback事件完成图片上传(图片删除如何实现)
   * editorStyle 实现编辑框的样式修改
   * onEditorStateChange 监听文字输入，并且更新state
   *
   *
   */
  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={this.onEditorStateChange}
        editorStyle={{
          minHeight: 200,
          border: "1px solid black",
          paddingLeft: 10
        }}
        toolbar={{
          image: {
            uploadCallback: this.uploadImageCallBack,
            alt: { present: true, mandatory: true }
          }
        }}
      />
    );
  }
}
