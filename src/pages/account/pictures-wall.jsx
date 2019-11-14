import React from "react";
import { Upload, Icon, Modal, message } from "antd";
import PropTypes from "prop-types";

import { deleteImg } from "../../api";
import { BASE_IMG_URL } from "../../config/constantConfig";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  static propTypes = {
    imgs: PropTypes.array
  };

  /**
   * 初始化 state 属性使用构造函数
   * 使用同步方式更新state 属性,使用 UNSAFE_componentWillMount
   * 使用异步方式更新 state 属性，使用 componentDidMount
   */
  constructor(props) {
    super(props);
    const { imgs } = this.props;
    const fileList = [];
    if (imgs && imgs.length > 0) {
      imgs.forEach((name, index) => {
        fileList.push({
          uid: -index,
          name,
          status: "done",
          url: `${BASE_IMG_URL}${name}`
        });
      });
    }
    // 初始化状态
    this.state = {
      previewVisible: false, // 标识是否显示大图预览Modal
      previewImage: "", // 大图的url
      fileList // 所有已上传图片的数组
    };
  }

  // 预览modal取消事件
  handleCancel = () => this.setState({ previewVisible: false });

  // 预览事件
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    });
  };

  /**
   * 上传状态改变回调函数
   * 上传成功，修改本地fileList 状态中的name
   * 根据 file status 判断事件类型，是上传，删除，还是更新状态
   */
  handleChange = async ({ file, fileList, event }) => {
    this.setState({ fileList });
    if (file.status === "done") {
      file = fileList[fileList.length - 1];
      file.name = fileList[fileList.length - 1].response.data.name;
      message.success("上传成功");
    } else if (file.status === "removed") {
      const response = await deleteImg(file.name);
      if (response.status === 0) {
        message.success("删除成功");
      } else {
        message.error("删除失败");
      }
    }
  };

  /**
   * 将 fileList 传递给父组件，用于获取文件名称
   */
  getFileList = () => {
    return this.state.fileList.map(file => file.name);
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" // 上传服务器接口地址
          listType="picture-card" // 图片框样式
          name="image" // 发送到后台的文件参数名称
          fileList={fileList} // 上传的文件
          accept="image/*" // 显示文件显示格式
          onPreview={this.handlePreview} // 预览事件
          onChange={this.handleChange} // 状态改变事件
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
