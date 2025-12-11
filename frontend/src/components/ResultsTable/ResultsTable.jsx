import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './ResultsTable.css';
import {Suspense} from "react";

function ResultsTable({ points, onRefresh, onClear }) {
    const hitBody = (rowData) => (
        <span className={rowData.hit ? 'hit-yes' : 'hit-no'}>
            {rowData.hit ? 'Попадание' : 'Промах'}
        </span>
    );

    const executionTimeBody = (rowData) => `${rowData.executionTimeNs} ns`;

    return (
        <div style={{width:'100%'}}>
            <div className="buttons-row">
                <Suspense fallback={<div
                    style={{height: '50px', width: '200px', background: '#a341a1', borderRadius: '4px'}}></div>}>
                    <Button label="Обновить таблицу" onClick={onRefresh} className="update-button" style={{
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}/>
                </Suspense>
                <Suspense fallback={<div
                    style={{height: '50px', width: '200px', background: '#a341a1', borderRadius: '4px'}}></div>}>
                    <Button label="Очистить историю" onClick={onClear} className="clear-button" style={{
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}/>
                </Suspense>
            </div>

            <Suspense fallback={<div style={{ width: '100%', height: '300px', background: 'rgba(255, 255, 255, 0.75)', borderRadius: '8px' }}>Загрузка таблицы...</div>}>
                <DataTable id="resultsTable" className="custom-datatable" value={points} responsiveLayout="scroll" emptyMessage="Точек нет">
                    <Column field="x" header="X" />
                    <Column field="y" header="Y"/>
                    <Column field="z" header="Z"/>
                    <Column field="r" header="R"/>
                    <Column header="Попадание" body={hitBody}/>
                    <Column field="currentTime" header="Время запроса"/>
                    <Column header="Время выполнения" body={executionTimeBody}/>
                </DataTable>
            </Suspense>
        </div>
    );
}

export default ResultsTable;
