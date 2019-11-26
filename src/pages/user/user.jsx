import React, { Component } from "react";
import { Card, Table, Button, message, Modal, Popconfirm } from "antd";
import { connect } from "react-redux";

import { resetUser } from "../../redux/actions";
import { PAGE_SIZE } from "../../config/constantConfig";
import { getUserList, addOrUpdateUser, deleteUser } from "../../api";
import LinkButton from "../../components/link-button";
import { formateDate } from "../../utils/dateUtils";
import UserForm from "./user-form";
class User extends Component {
  state = {
    user: {}, //用来判断是添加还是修改
    loading: true,
    roles: [],
    users: [], // 用户列表
    visible: false //0关闭显示，1显示添加，2显示修改
  };

  initColumns = () => {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username"
      },
      {
        title: "邮箱",
        dataIndex: "email"
      },
      {
        title: "电话",
        dataIndex: "phone"
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        render: formateDate
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        render: role_id => this.roleNames.get(role_id)
      },
      {
        title: "操作",
        render: user => {
          return (
            <div>
              <LinkButton onClick={() => this.showModal(user)}>修改</LinkButton>
              <Popconfirm
                title="确认删除这个用户吗?"
                onConfirm={() => this.delUser(user.id)}
                okText="确认"
                cancelText="取消"
              >
                <LinkButton>删除</LinkButton>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
  };

  initRoleNames = roles => {
    const roleNames = roles.reduce((pre, role) => {
      pre.set(role._id, role.name);
      return pre;
    }, new Map());
    this.roleNames = roleNames;
  };

  getUserList = async () => {
    const response = await getUserList();
    console.log("getUserList :", response);
    if (response && response.status === "success") {
      const { users, roles } = response.data;
      this.initRoleNames(roles);
      this.setState({ users, roles, loading: false });
    } else {
      message.error("获取用户列表失败");
    }
  };

  showModal = user => {
    this.setState({
      user,
      visible: true
    });
  };

  submint = () => {
    this.form.validateFields(async (error, value) => {
      if (!error) {
        const { username, password, phone, email, roleId } = value;
        const user = {
          username,
          password,
          phone,
          email,
          roleId
        };
        //判断是添加还是修改
        if (this.state.user) {
          user.id = this.state.user.id;
        }
        const response = await addOrUpdateUser(user);
        if (response && response.status === "success") {
          if (this.props.user.username === username) {
            message.success(`更新角色是当前用户角色，请重新登陆`);
            this.props.resetUser();
          } else {
            message.success(`${user.id ? "更新" : "添加"}成功`);
          }
          // 如果修改的是当前用户的角色，需要重新登陆，刷新菜单栏
        } else {
          message.error(`${user.id ? "更新" : "添加"}失败`);
        }

        this.getUserList();
        this.form.resetFields();
        this.setState({
          visible: false
        });
      } else {
        message.error("验证失败");
      }
    });
  };

  // 删除用户
  delUser = async userId => {
    const response = await deleteUser(userId);
    if (response && response.status === "success") {
      message.success("删除成功");
      this.setState({
        loading: true
      });
      this.getUserList();
    } else {
      message.error("删除失败");
    }
  };

  //加载异步初始化数据
  componentDidMount() {
    this.getUserList();
  }

  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  render() {
    console.log("user render()");
    const { loading, users, visible, roles, user } = this.state;
    const title = (
      <Button type="primary" onClick={this.showModal}>
        创建用户
      </Button>
    );

    return (
      <Card title={title}>
        <Modal
          title={!user.id ? "创建用户" : "修改用户"}
          visible={visible}
          onOk={this.submint}
          onCancel={() => {
            this.setState({
              visible: false
            });
          }}
          okText="确认"
          cancelText="取消"
        >
          <UserForm
            user={user}
            roles={roles}
            setForm={form => (this.form = form)}
          />
        </Modal>
        <Table
          loading={loading}
          bordered={true}
          rowKey="_id"
          columns={this.columns}
          dataSource={users}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true
          }}
        />
      </Card>
    );
  }
}

export default connect(state => ({ user: state.user }), { resetUser })(User);
