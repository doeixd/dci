import React from 'react'
import ReactDOM from 'react-dom'
import { Table, Typography } from 'antd';
import 'antd/dist/antd.css';
const Title = { Typography }
let mountNode = document.getElementById('root')
let ranksNode = document.getElementById('ranks')
// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
let datas
fetch('http://208.167.245.45/data')
  .then(res => res.json())
  .then(res => Object.keys(res).map(i => res[i]))
  .then(res => datas = res)
  .then(res => ReactDOM.render(<Table size="middle" rowKey={record => Math.random()} expandedRowRender={(fun) => expandedRowRender([fun]) } pagination={false}  columns={columns} dataSource={datas} bordered />, mountNode))

let rankColumns = [
  { title: 'Corps', dataIndex: 'name', align: 'center', render: (val, row, index) => { if (row.GE) { return (<div style={{padding: '8px', background: '#e6f7ff', margin: '-8px'}}>{val}</div>)}else {return val} } },
  {title: 'Latest Score', 
  dataIndex: 'total',    
  defaultSortOrder: 'descend',
    align: 'center',
    sorter: (a, b) => { return Number(a.total) - Number(b.total) }, render: (val, row, index) => { if (row.GE) { return (<div style={{ padding: '8px', background: '#e6f7ff', margin: '-8px' }}>{val}</div>) } else { return val } }
}
]

let ranks
fetch('https://backend.dci.org/api/v1/performances/overall-rankings')
  .then(res => res.json())
  .then(res => ranks = res)
  .then(res => ranks.map((val) => {val.total = val.lastScore; val.name = val._id}))
  .then(res => ranks.concat(datas))
  .then(res => ReactDOM.render(<Table size="middle"  rowKey={record => Math.random()}  pagination={false} columns={rankColumns} dataSource={res} bordered />, ranksNode))



const expandedRowRender = (fun) => {

  const columns = [
    { title: 'Name', dataIndex: 'name', render: (doc => doc)}, 
    {title: 'Caption Picks', 
    children: [
      { title: 'General Effect', dataIndex: 'GE', align: 'center' },
      { title: 'Visual', dataIndex: 'VA', align: 'center' },
      { title: 'Color Gaurd', dataIndex: 'CG', align: 'center' },
      { title: 'Music - Analysis', dataIndex: 'MA', align: 'center'},
      { title: 'Music - Brass', dataIndex: 'BRS', align: 'center'},
      { title: 'Music - Percussion', dataIndex: 'Perc', align: 'center'},

    ]
    }

  ];

let data = fun.reduce((acc, cur) => {
  cur.choices.name = cur.name
  acc.push(cur.choices)
  return acc
}, [])
console.log(data)

  return <Table columns={columns} rowKey={record => Math.random()} dataSource={data} pagination={false} />;
};
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
    title: 'Visual',
    children: [
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
      }
    ]
  },
  {
    title: 'Music',
    children: [
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
        dataIndex: 'Perc',
        align: 'center'
      }
    ]
  },

  {
    title: 'Total',
    dataIndex: 'total',
    align: 'center',
    // key:'name',
    defaultSortOrder: 'descend',
    sorter: (a, b) => { return Number(a.total) - Number(b.total)},
    // sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
  },
];



// ReactDOM.render(<Table columns={columns} dataSource={datas} bordered />, mountNode);