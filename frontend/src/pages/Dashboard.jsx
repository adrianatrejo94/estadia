import React, { useState, useEffect } from 'react';  
import { Panel } from 'primereact/panel';  
import { DataTable } from 'primereact/datatable';  
import { Column } from 'primereact/column';  
import { Button } from 'primereact/button';  
import { Checkbox } from 'primereact/checkbox';  
import { InputText } from 'primereact/inputtext';  
import { InputTextarea } from 'primereact/inputtextarea';  
import { Dropdown } from 'primereact/dropdown';  
import { Calendar } from 'primereact/calendar';  
import { Chart } from 'primereact/chart';  
import { useAuth } from '../context/AuthContext';  
import Template from '../components/layout/Template';  
  
/**  
 * Componente Dashboard 
   
 * Funcionalidades principales:  
 * - Tarjetas de resumen con estadísticas  
 * - Panel de tareas  
 * - Formulario de contacto  
 * - Lista de contactos  
 * - Tarjeta de perfil de usuario  
 * - Chat interface  
 * - Timeline de actividades  
 * - Tabla de productos  
 * - Gráfico de ventas  
 */  
const Dashboard = () => {  
  const { user } = useAuth();  
  const [products, setProducts] = useState([]);  
  const [tasks, setTasks] = useState([  
    { id: 1, name: 'Finalizar propuesta', icon: 'pi-file', completed: false },  
    { id: 2, name: 'Desarrollar aplicación', icon: 'pi-cog', completed: false },  
    { id: 3, name: 'Generar gráficos', icon: 'pi-chart-bar', completed: false },  
    { id: 4, name: 'Llamar cliente', icon: 'pi-mobile', completed: false },  
    { id: 5, name: 'Compartir ubicación', icon: 'pi-map-marker', completed: false },  
    { id: 6, name: 'Crear feed', icon: 'pi-wifi', completed: false }  
  ]);  
  
  // Datos del gráfico de ventas - equivalente al script Chart.js del original  
  const [chartData] = useState({  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],  
    datasets: [  
      {  
        label: 'Primer Dataset',  
        data: [65, 59, 80, 81, 56, 55, 40],  
        fill: false,  
        borderColor: '#FFC107'  
      },  
      {  
        label: 'Segundo Dataset',  
        data: [28, 48, 40, 19, 86, 27, 90],  
        fill: false,  
        borderColor: '#03A9F4'  
      }  
    ]  
  });  
  
  const [chartOptions] = useState({  
    responsive: true,  
    maintainAspectRatio: false  
  });  
  
  useEffect(() => {  
    // Simular carga de productos para la tabla  
    setProducts([  
      { id: 1, category: 'Accesorios', price: 65, inventoryStatus: 'INSTOCK' },  
      { id: 2, category: 'Fitness', price: 72, inventoryStatus: 'LOWSTOCK' },  
      { id: 3, category: 'Ropa', price: 79, inventoryStatus: 'OUTOFSTOCK' },  
      { id: 4, category: 'Electrónicos', price: 85, inventoryStatus: 'INSTOCK' },  
      { id: 5, category: 'Accesorios', price: 25, inventoryStatus: 'INSTOCK' }  
    ]);  
  }, []);  
  
  const handleTaskChange = (taskId) => {  
    setTasks(tasks.map(task =>   
      task.id === taskId ? { ...task, completed: !task.completed } : task  
    ));  
  };  
  
  const statusBodyTemplate = (product) => {  
    return <span className={`product-badge status-${product.inventoryStatus.toLowerCase()}`}>  
      {product.inventoryStatus}  
    </span>;  
  };  
  
  const priceBodyTemplate = (product) => {  
    return `$${product.price}`;  
  };  
  
  return (  
    <Template title="Dashboard">  
      {/* Grid principal del dashboard - equivalente a class="grid dashboard" */}  
      <div className="grid dashboard">  
          
        {/* Tarjetas de resumen - equivalente a overview-box del original */}  
        <div className="col-12 md:col-6 lg:col-3">  
          <div className="grid card grid-nogutter overview-box overview-box-1">  
            <div className="col-4 overview-box-icon">  
              <img src="/verona-layout/images/icon-paper.png" alt="Documentos" />  
            </div>  
            <div className="col-8">  
              <span className="overview-box-count">253</span>  
              <span className="overview-box-name">DOCUMENTOS RECIBIDOS</span>  
              <span className="overview-box-rate">+10%</span>  
            </div>  
          </div>  
        </div>  
  
        <div className="col-12 md:col-6 lg:col-3">  
          <div className="grid card grid-nogutter overview-box overview-box-2">  
            <div className="col-4 overview-box-icon">  
              <img src="/verona-layout/images/icon-mail.png" alt="Emails" />  
            </div>  
            <div className="col-8">  
              <span className="overview-box-count">3216</span>  
              <span className="overview-box-name">EMAILS RECIBIDOS</span>  
              <span className="overview-box-rate">+34%</span>  
            </div>  
          </div>  
        </div>  
  
        <div className="col-12 md:col-6 lg:col-3">  
          <div className="grid card grid-nogutter overview-box overview-box-3">  
            <div className="col-4 overview-box-icon">  
              <img src="/verona-layout/images/icon-location.png" alt="Ubicaciones" />  
            </div>  
            <div className="col-8">  
              <span className="overview-box-count">428</span>  
              <span className="overview-box-name">UBICACIONES VISITADAS</span>  
              <span className="overview-box-rate">+12%</span>  
            </div>  
          </div>  
        </div>  
  
        <div className="col-12 md:col-6 lg:col-3">  
          <div className="grid card grid-nogutter overview-box overview-box-4">  
            <div className="col-4 overview-box-icon">  
              <img src="/verona-layout/images/icon-orders.png" alt="Órdenes" />  
            </div>  
            <div className="col-8">  
              <span className="overview-box-count">924</span>  
              <span className="overview-box-name">NUEVAS ÓRDENES</span>  
              <span className="overview-box-rate">+24%</span>  
            </div>  
          </div>  
        </div>  
  
        {/* Panel de tareas - equivalente al task panel del original */}  
        <div className="col-12 md:col-6 lg:col-4">  
          <Panel header="TAREAS" style={{ minHeight: '360px' }}>  
            <ul className="task-list">  
              {tasks.map(task => (  
                <li key={task.id}>  
                  <Checkbox   
                    checked={task.completed}  
                    onChange={() => handleTaskChange(task.id)}  
                  />  
                  <span className="task-name">{task.name}</span>  
                  <i className={`pi ${task.icon}`}></i>  
                </li>  
              ))}  
            </ul>  
          </Panel>  
        </div>  
  
        {/* Formulario de contacto - equivalente al contact form del original */}  
        <div className="col-12 md:col-6 lg:col-4 ui-fluid contact-form">  
          <Panel header="CONTÁCTANOS" style={{ minHeight: '360px' }}>  
            <div className="grid">  
              <div className="col-12">  
                <Dropdown   
                  placeholder="Seleccionar ciudad"  
                  options={[  
                    { label: 'Nueva York', value: 'ny' },  
                    { label: 'Roma', value: 'roma' },  
                    { label: 'París', value: 'paris' },  
                    { label: 'Estambul', value: 'istanbul' },  
                    { label: 'Berlín', value: 'berlin' }  
                  ]}  
                />  
              </div>  
              <div className="col-12">  
                <InputText placeholder="Nombre" />  
              </div>  
              <div className="col-12">  
                <InputText placeholder="Edad" />  
              </div>  
              <div className="col-12">  
                <InputText placeholder="Email" />  
              </div>  
              <div className="col-12">  
                <InputTextarea placeholder="Mensaje" rows={2} autoResize={false} />  
              </div>  
              <div className="col-12">  
                <Button label="Enviar" icon="pi pi-plus" />  
              </div>  
            </div>  
          </Panel>  
        </div>  
  
        {/* Lista de contactos - equivalente al contacts panel del original */}  
        <div className="col-12 lg:col-4 contacts">  
          <Panel header="CONTACTOS" style={{ minHeight: '360px' }}>  
            <ul>  
              <li className="clearfix">  
                <img src="/verona-layout/images/avatar.png" width="45" alt="Avatar" />  
                <div className="contact-info">  
                  <span className="name">Anna Fali</span>  
                  <span className="location">anna@pf-verona.com</span>  
                </div>  
                <div className="contact-actions">  
                  <span className="connection-status online">online</span>  
                  <i className="pi pi-share-alt"></i>  
                  <i className="pi pi-comments"></i>  
                </div>  
              </li>  
              <li className="clearfix">  
                <img src="/verona-layout/images/avatar3.png" width="45" alt="Avatar" />  
                <div className="contact-info">  
                  <span className="name">Tim Johnson</span>  
                  <span className="location">tim@pf-verona.com</span>  
                </div>  
                <div className="contact-actions">  
                  <span className="connection-status online">online</span>  
                  <i className="pi pi-share-alt"></i>  
                  <i className="pi pi-comments"></i>  
                </div>  
              </li>  
            </ul>  
          </Panel>  
        </div>  
  
        {/* Tarjeta de usuario - equivalente al user card del original */}  
        <div className="col-12 md:col-4">  
          <div className="user-card">  
            <div className="user-card-header">  
              <img src="/verona-layout/images/dashboard/verona-photo.png" alt="Header" />  
            </div>  
            <div className="user-card-content">  
              <img src="/verona-layout/images/avatar.png" alt="Avatar" />  
              <span className="user-card-name">Samantha Owens</span>  
              <span className="user-card-role">Administrador del Sistema</span>  
              <p>  
                Retro occupy organic, stumptown shabby chic pour-over roof party DIY normcore.  
                Actually artisan organic occupy, Wes Anderson ugh whatever pour-over gastropub selvage.  
              </p>  
              <Button label="Conectar" />  
            </div>  
            <div className="user-card-footer">  
              <div className="grid">  
                <div className="col-4">  
                  <span>Issues</span>  
                  <span>52</span>  
                </div>  
                <div className="col-4">  
                  <span>Abiertos</span>  
                  <span>25</span>  
                </div>  
                <div className="col-4">  
                  <span>Cerrados</span>  
                  <span>27</span>  
                </div>  
              </div>  
            </div>  
          </div>  
        </div>  
  
        {/* Timeline de actividades - equivalente al timeline del original */}  
        <div className="col-12 lg:col-4">  
          <div className="card timeline ui-fluid">  
            <div className="grid">  
              <div className="col-3">  
                <span className="event-time">ahora</span>  
                <i className="pi pi-map-marker" style={{ color: '#f7cb00' }}></i>  
              </div>  
              <div className="col-9">  
                <span className="event-owner" style={{ color: '#f7cb00' }}>Katherine May</span>  
                <span className="event-text">Lorem ipsum dolor amet</span>  
                <div className="event-content">  
                  <img src="/verona-layout/images/dashboard/bridge.png" width="100" alt="Bridge" />  
                </div>  
              </div>  
                
              <div className="col-3">  
                <span className="event-time">hace 12h</span>  
                <i className="pi pi-star" style={{ color: '#985edb' }}></i>  
              </div>  
              <div className="col-9">  
                <span className="event-owner" style={{ color: '#985edb' }}>Brandon Santos</span>  
                <span className="event-text">Ab nobis, magnam sunt eum. Laudantium, repudiandae, similique!</span>  
              </div>  
                
              <div className="col-12">  
                <Button label="Actualizar" icon="pi pi-refresh" />  
              </div>  
            </div>  
          </div>  
        </div>  
  
        {/* Tabla de productos y gráfico - equivalente a la sección de datos del original */}  
        <div className="col-12 lg:col-8">  
          <div className="card">  
            <DataTable   
              value={products}   
              paginator   
              rows={5}   
              paginatorPosition="bottom"  
              reflow="true"  
            >  
              <Column field="id" header="Id" sortable />  
              <Column field="category" header="Categoría" sortable />  
              <Column field="price" header="Precio" body={priceBodyTemplate} sortable />  
              <Column field="inventoryStatus" header="Estado" body={statusBodyTemplate} sortable />  
              <Column   
                body={() => <Button icon="pi pi-search" />}   
                style={{ textAlign: 'center' }}  
              />  
            </DataTable>  
  
            <Panel header="GRÁFICO DE VENTAS" style={{ overflow: 'auto' }}>  
              <Chart type="line" data={chartData} options={chartOptions} height="300px" />  
            </Panel>  
          </div>  
        </div>  
  
        {/* Panel de actividades financieras */}  
        <div className="col-12 lg:col-4">  
          <Panel header="ACTIVIDADES" style={{ minHeight: '360px' }}>  
            <ul className="activity-list">  
              <li>  
                <div className="count" style={{ backgroundColor: '#f18983' }}>$520</div>  
                <div className="grid">  
                  <div className="col-6">Ingresos</div>  
                  <div className="col-6">95%</div>  
                </div>  
              </li>  
              <li>  
                <div className="count" style={{ backgroundColor: '#9fd037' }}>$250</div>  
                <div className="grid">  
                  <div className="col-6">Impuestos</div>  
                  <div className="col-6">24%</div>  
                </div>  
              </li>  
              <li>  
                <div className="count" style={{ backgroundColor: '#ff9c59' }}>$125</div>  
                <div className="grid">  
                  <div className="col-6">Facturas</div>  
                  <div className="col-6">55%</div>  
                </div>  
              </li>  
              <li>  
                <div className="count" style={{ backgroundColor: '#985edb' }}>$250</div>  
                <div className="grid">  
                  <div className="col-6">Gastos</div>  
                  <div className="col-6">15%</div>  
                </div>  
              </li>  
            </ul>  
          </Panel>  
        </div> 
        {/* User Card - equivalente al user-card del original */}  
        <div className="col-12 md:col-4">  
          <div className="user-card">  
            <div className="user-card-header">  
              <img src="/verona-layout/images/dashboard/verona-photo.png" alt="Header" />  
            </div>  
            <div className="user-card-content">  
              <img src="/verona-layout/images/avatar.png" alt="Avatar" />  
              <span className="user-card-name">{user?.nombres || 'Usuario'} {user?.apellidoPaterno || ''}</span>  
              <span className="user-card-role">System Admin</span>  
              <p>  
                Retro occupy organic, stumptown shabby chic pour-over roof party DIY normcore.   
                Actually artisan organic occupy, Wes Anderson ugh whatever pour-over gastropub selvage.  
                Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.  
              </p>  
              <Button label="Connect" />  
            </div>  
            <div className="user-card-footer">  
              <div className="grid">  
                <div className="col-4">  
                  <span>Issues</span>  
                  <span>52</span>  
                </div>  
                <div className="col-4">  
                  <span>Open</span>  
                  <span>25</span>  
                </div>  
                <div className="col-4">  
                  <span>Closed</span>  
                  <span>27</span>  
                </div>  
              </div>  
            </div>  
          </div>  
        </div>  
  
        {/* Chat Interface - equivalente al chat del original */}  
        <div className="col-12 md:col-8 chat">  
          <Panel header="CHAT">  
            <ul>  
              <li className="clearfix message-from">  
                <img src="/verona-layout/images/avatar2.png" alt="Avatar" />  
                <span>Retro occupy organic, stumptown shabby chic pour-over roof party DIY normcore.</span>  
              </li>  
              <li className="clearfix message-own">  
                <img src="/verona-layout/images/avatar.png" alt="Avatar" />  
                <span>Actually artisan organic occupy, Wes Anderson ugh whatever pour-over gastropub selvage.</span>  
              </li>  
              <li className="clearfix message-from">  
                <img src="/verona-layout/images/avatar2.png" alt="Avatar" />  
                <span>Chillwave craft beer tote bag stumptown quinoa hashtag.</span>  
              </li>  
              <li className="clearfix message-own">  
                <img src="/verona-layout/images/avatar.png" alt="Avatar" />  
                <span>Dreamcatcher locavore iPhone chillwave, occupy trust fund slow-carb distillery art party narwhal.</span>  
              </li>  
            </ul>  
            <div className="new-message">  
              <div className="message-attachment">  
                <i className="pi pi-paperclip"></i>  
              </div>  
              <div className="message-input">  
                <InputText placeholder="Write a message" />  
              </div>  
            </div>  
          </Panel>  
        </div>  
  
        {/* Timeline - equivalente al timeline del original */}  
        <div className="col-12 lg:col-4">  
          <div className="card timeline ui-fluid">  
            <div className="grid">  
              <div className="col-3">  
                <span className="event-time">just now</span>  
                <i className="pi pi-map-marker" style={{color:'#f7cb00'}}></i>  
              </div>  
              <div className="col-9">  
                <span className="event-owner" style={{color:'#f7cb00'}}>Katherine May</span>  
                <span className="event-text">Lorem ipsum dolor amet</span>  
                <div className="event-content">  
                  <img src="/verona-layout/images/dashboard/bridge.png" width="100" alt="Bridge" />  
                </div>  
              </div>  
  
              <div className="col-3">  
                <span className="event-time">12h ago</span>  
                <i className="pi pi-star" style={{color:'#985edb'}}></i>  
              </div>  
              <div className="col-9">  
                <span className="event-owner" style={{color:'#985edb'}}>Brandon Santos</span>  
                <span className="event-text">Ab nobis, magnam sunt eum. Laudantium, repudiandae, similique!</span>  
              </div>  
  
              <div className="col-3">  
                <span className="event-time">15h ago</span>  
                <i className="pi pi-comment" style={{color:'#9fd037'}}></i>  
              </div>  
              <div className="col-9">  
                <span className="event-owner" style={{color:'#9fd037'}}>Stephan Ward</span>  
                <span className="event-text">Omnis veniam quibusdam ratione est repellat qui nam quisquam ab mollitia dolores.</span>  
              </div>  
  
              <div className="col-3">  
                <span className="event-time">2d ago</span>  
                <i className="pi pi-globe" style={{color:'#f7cb00'}}></i>  
              </div>  
              <div className="col-9">  
                <span className="event-owner" style={{color:'#f7cb00'}}>Jason Smith</span>  
                <span className="event-text">Laudantium, repudiandae, similique!</span>  
                <div className="event-content">  
                  <img src="/verona-layout/images/dashboard/map.png" alt="Map" />  
                </div>  
              </div>  
  
              <div className="col-12">  
                <Button label="Refresh" icon="pi pi-refresh" />  
              </div>  
            </div>  
          </div>  
        </div>  
  
        {/* DataTable y Sales Graph - equivalente al original */}  
        <div className="col-12 lg:col-8">  
          <div className="card">  
            <DataTable   
              value={products}   
              paginator   
              rows={5}   
              paginatorPosition="bottom"  
              reflow="true"  
            >  
              <Column field="id" header="Id" sortable />  
              <Column field="category" header="Category" sortable />  
              <Column field="price" header="Price" body={priceBodyTemplate} sortable />  
              <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable />  
              <Column   
                body={() => <Button icon="pi pi-search" />}   
                style={{textAlign: 'center'}}  
              />  
            </DataTable>  
  
            <Panel header="SALES GRAPH" style={{overflow:'auto', marginTop: '20px'}}>  
              <Chart type="line" data={chartData} options={chartOptions} style={{height: '300px'}} />  
            </Panel>  
          </div>  
        </div>  
  
        {/* Verona Overview - equivalente al verona-overview del original */}  
        <div className="col-12 lg:col-6">  
          <div className="card verona-overview">  
            <img src="/verona-layout/images/dashboard/verona-map.jpg" alt="Verona" />  
            <span className="article-date">January 2017</span>  
            <h3>VERONA</h3>  
            <p>  
              Verona is a city on the Adige river in Veneto, northern Italy,  
              with approximately 265,000 inhabitants and one of the seven provincial capitals of the region.   
              It is the second largest city municipality in the region and the third largest in northeast Italy.  
            </p>  
          </div>  
        </div>  
  
        {/* Activity Feed - equivalente al activity-feed del original */}  
        <div className="col-12 lg:col-6 activity-feed">  
          <Panel header="ACTIVITY FEED">  
            <h3>Last Activity</h3>  
            <p>Updated 1 minute ago</p>  
            <div className="grid">  
              <div className="col-12 md:col-6">  
                <span>INCOME</span>  
                <div className="knob income">$900</div>  
              </div>  
              <div className="col-12 md:col-6">  
                <span>TAX</span>  
                <div className="knob tax">$250</div>  
              </div>  
              <div className="col-12 md:col-6">  
                <span>INVOICES</span>  
                <div className="knob invoice">$125</div>  
              </div>  
              <div className="col-12 md:col-6">  
                <span>EXPENSES</span>  
                <div className="knob expense">$250</div>  
              </div>  
            </div>  
          </Panel>  
        </div>  
  
        {/* Calendar - equivalente al calendar del original */}  
        <div className="col-12 md:col-8">  
          <Panel header="CALENDAR" style={{height:'100%'}}>  
            <Calendar   
              value={new Date()}   
              inline   
              showWeek   
              style={{width: '100%'}}  
            />  
          </Panel>  
        </div>  
  
        {/* Activity List - equivalente al activity del original */}  
        <div className="col-12 md:col-4">  
          <Panel header="ACTIVITY" style={{height:'100%'}}>  
            <div className="activity-header">  
              <div className="grid">  
                <div className="col-6">  
                  <span style={{fontWeight:'bold'}}>Last Activity</span>  
                  <p>Updated 1 minute ago</p>  
                </div>  
                <div className="col-6" style={{textAlign:'right'}}>  
                  <Button icon="pi pi-refresh" />  
                </div>  
              </div>  
            </div>  
            <ul className="activity-list">  
              <li>  
                <div className="count">$900</div>  
                <div className="grid">  
                  <div className="col-6">Income</div>  
                  <div className="col-6">95%</div>  
                </div>  
              </li>  
              <li>  
                <div className="count" style={{backgroundColor:'#9fd037'}}>$250</div>  
                <div className="grid">  
                  <div className="col-6">Tax</div>  
                  <div className="col-6">24%</div>  
                </div>  
              </li>  
              <li>  
                <div className="count" style={{backgroundColor:'#ff9c59'}}>$125</div>  
                <div className="grid">  
                  <div className="col-6">Invoices</div>  
                  <div className="col-6">55%</div>  
                </div>  
              </li>  
              <li>  
                <div className="count" style={{backgroundColor:'#985edb'}}>$250</div>  
                <div className="grid">  
                  <div className="col-6">Expenses</div>  
                  <div className="col-6">15%</div>  
                </div>  
              </li>  
            </ul>  
          </Panel>  
        </div>    
      </div>  
    </Template>  
  );  
};  
  
export default Dashboard;  