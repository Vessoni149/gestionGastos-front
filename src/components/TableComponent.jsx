import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { showAlert } from '../functions';
export function TableComponent(props) {
const url = 'https://gestiongastosback.onrender.com';
const [gastos, setGastos] = useState([]);
const [id, setId] = useState('');
const [concepto, setConcepto] = useState('');
const [monto, setMonto] = useState('');
const [pagador, setPagador] = useState('-----');
const [operacion, setOperacion] = useState(1);
const [title, setTitle] = useState('');

  useEffect( ()=>{
    getGastos();
  },[gastos])
  
  const getGastos = async ()=>{
    try{
      const respuesta = await axios.get(url + '/gastos/traer');
      setGastos(respuesta.data)
    } catch (error){
      console.error('Error fetching data', error);
    }
  }

  const openModal = (op, id, concepto, monto, pagador)=>{
    setId('');
    setConcepto('');
    setMonto('');
    setPagador('-----');
    setOperacion(op);
    if(op === 1){
      setTitle('Registrar gasto');
    }else if(op === 2){
      setTitle('Editar gasto');
      setId(id);
      setConcepto(concepto);
      setMonto(monto);
      setPagador(pagador);
    }
    window.setTimeout(function(){
      document.getElementById('concepto').focus();
    }, 500);
  }

  const validar = ()=>{
    let parametros;
    let metodo;
    let url2;
    if(concepto.length === 0){
      showAlert('Escribe el concepto del gasto', 'warning');
    }
    else if(monto.length === 0){
      showAlert('Escribe el monto del gasto', 'warning')
    }
    else if(pagador.length === 0){
      showAlert('Escribe el nombre de quien pagó', 'warning')
    }
    else{
      if(operacion === 1){
        parametros = {concepto:concepto.trim(), monto: monto, pagador: pagador.trim()};
        metodo = 'POST';
        url2 = url + '/gastos/crear';
      }
      else{
        parametros= {id:id, concepto:concepto.trim(), monto: monto, pagador: pagador.trim()};
        metodo = 'PUT';
        url2 = url + '/gastos/editar';
      }
      enviarSolicitud(metodo,parametros,url2);
    }
    setPagador("-----");
  }
    const enviarSolicitud = async(metodo,parametros,url2) =>{
      await axios({method:metodo, url: url2, data:parametros}).then(function(respuesta){
        var tipo = "success";
        var msj = "Guardado correctamente";
        showAlert(msj,tipo);
        if(tipo === 'success'){
          document.getElementById('btnCerrar').click();
          getGastos();
        }
      })
      .catch(function(error){
        showAlert('Error en la solicitud', 'error');
        console.log(error);
      });
    }

    const deleteGasto =(id)=>{
      const borrar = async(id) =>{
        await axios.delete(url + `/gastos/borrar/${id}`)
      }
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: '¿Seguro que desea eliminar el gasto?',
        icon:'question', text:'Se eliminara definitivamente.',
        showCancelButton: true, confirmButtonText:'Si, eliminar', cancelButtonText:'Candelar'
      }).then((result)=>{
        if(result.isConfirmed){
          borrar(id);
        }
        else{
          showAlert('El gasto NO fue eliminado', 'info');
        }
      })
    }

    let totalAgustin = 0;
    let totalMariana = 0;
    let deuda = 0;
    gastos.forEach((gasto)=>{
      if(gasto.pagador === "Agustin"){
      totalAgustin+= gasto.monto;
    }else if(gasto.pagador === "Mariana"){
      totalMariana += gasto.monto;
    }
    })

    const calcularDeuda = ()=> {
    if(totalAgustin < totalMariana){
      deuda = totalMariana - totalAgustin;
      return `Agustin debe ${deuda / 2} a Mariana.`;
    }
    if(totalAgustin > totalMariana){
      deuda = totalAgustin - totalMariana;
      return `Mariana debe ${deuda / 2} a Agustin.`;
    }
    if(totalAgustin === totalMariana){
      deuda = 0;
      return "Ambos gastaron lo mismo";
    }
  }

  return (
    <div className='App'> 
      <div className='container-fluid'>
        <div className='row mt-3'>
            <div className='col-md-4 offset-md-4'>
              <div className='d-grid mx-auto'>
                <button onClick={()=>{openModal(1)}} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalGastos'>
                  <i className='fa-solid fa-circle-plus'></i>Añadir
                </button>
              </div>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
              <div className='table-responsive'>
                <table className='table table-bordered'>
                <thead>
                  <tr><th>CONCEPTO</th> <th>MONTO</th> <th>PAGADOR</th></tr>
                </thead>
                <tbody className='table-group-divider'>
                {gastos.map((gasto) => (
                  <tr key={gasto.id}>
                    <td>{gasto.concepto}</td>
                    <td>{gasto.monto}</td>
                    <td>{gasto.pagador}</td>
                    <td>
                      <button onClick={()=>openModal(2, gasto.id, gasto.concepto, gasto.monto, gasto.pagador)}  
                      className='btn btn-warning'
                      data-bs-toggle='modal'
                      data-bs-target='#modalGastos'>
                        <i className='fa-solid fa-edit'></i>
                      </button>
                      &nbsp;
                      <button onClick={()=>deleteGasto(gasto.id)}
                      className='btn btn-danger'>
                        <i className='fa-solid fa-trash'></i>
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
                </table>
              </div>
            </div>
          </div>
      </div>

      <div id="modalGastos" className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
            </div>
            <div className='modal-body'>
              <input type="hidden" id='id'/>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input type="text" 
                id="concepto" 
                className='form-control' 
                placeholder='Concepto' 
                value={concepto} 
                onChange={(e)=>{ setConcepto(e.target.value)}}/>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                <input type="number" 
                id="monto" 
                className='form-control' 
                placeholder='Monto' 
                value={monto} 
                onChange={(e)=>{ setMonto(e.target.value)}}/>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                <select type="text" 
                id="pagador" 
                className='form-control' 
                placeholder='Pagador' 
                value={pagador}
                onChange={(e)=>{ setPagador(e.target.value)}}>
                  <option value="-----">-----</option>
                  <option value="Mariana">Mariana</option>
                  <option value="Agustin">Agustin</option>
                </select>
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={()=>{validar()}}
                className='btn btn-success'>
                  <i className='fa-solid fa-floppy-disk'></i>Guardar
                </button>
              </div>
            </div>
            <div 
            className='modal-footer'>
                <button id='btnCerrar' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3>Gastos totales:</h3>
        <p>Agustin gasto: {totalAgustin}</p>
        <p>Mariana gasto: {totalMariana}</p>
        <p>{calcularDeuda()}</p>
      </div>
    </div>
  )
}
