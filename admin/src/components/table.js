import React from 'react';
import MaterialTable from 'material-table'

export const Table = (props) => {
    const { style, actions, data, columns, options, title, detailPanel, editable } = props
    return (
        <MaterialTable actions={actions} data={data} columns={columns}
            title={title} editable={editable} options={options} style={style} detailPanel={detailPanel}
        />
    )
}
export default Table