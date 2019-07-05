import React from 'react'
import ReactDOM from 'react-dom'
import { Table } from 'antd';
import 'antd/dist/antd.css';
let mountNode = document.getElementById('root')
// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
const columns = [
  {
    title: 'Team Name',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: 'General Effect',
    dataIndex: 'GE',
    align: 'center'
  },
  {
    title: 'Visual - Analysis',
    dataIndex: 'VA',
    align: 'center'
  },
  {
    title: 'Visual Proficiency ',
    dataIndex: 'VP',
    align: 'center'
  },
  {
    title: 'Color Guard ',
    dataIndex: 'CG',
    align: 'center'
  },
  {
    title: 'Music -  Brass',
    dataIndex: 'BRS',
    align: 'center'
  },
  {
    title: 'Music - Analysis',
    dataIndex: 'MA',
    align: 'center'
  },
  {
    title: 'Music - Percussion',
    dataIndex: 'MA',
    align: 'center'
  },
  {
    title: 'Total',
    dataIndex: 'total',
    align: 'center'
  },
];
let datas
fetch('http://localhost/data')
  .then(res => res.json())
  .then(res => Object.keys(res).map(i => res[i]))
  .then(res => datas = res).then(res => console.log(datas))
  .then(res => ReactDOM.render(<Table size="middle" columns={columns} dataSource={datas} bordered />, mountNode))




const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    tel: '0571-22098909',
    phone: 18889898989,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    tel: '0571-22098333',
    phone: 18889898888,
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 18,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '5',
    name: 'Jake White',
    age: 18,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'Dublin No. 2 Lake Park',
  },
];
// ReactDOM.render(<Table columns={columns} dataSource={datas} bordered />, mountNode);