import React, { useState, useEffect, useRef, createRef } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  Container,
  BoxTitulo,
  Texto,
  RLeft,
  RRight,
  Botao,
  Grid as GridModal,
  Blank,
} from '../../Components/styles'

import { 
  Grid, 
  Row, 
  Col 
} from 'react-flexbox-grid'

import {
  Box,
  InputAdornment,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  withStyles,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import { Form } from './styles'
import Input from '../../Components/Forms/Input'
import * as Yup from 'yup'
// import { isCNPJ, isCPF } from 'brazilian-values'
import MaskedInput from 'react-text-mask'

import "./modal.css"

import dadosCadastro from '../../services/dados.json'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          {children}
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function clearNumber(value = '') {
  return value.replace(/\D+/g, '')
}

function formatCpfCnpj(props) {
  const { inputRef, value, ...other } = props

  // if (!value) {
  //   return value
  // }

  const clearValue = clearNumber(value)
  let sMask = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/]
  if (clearValue.length > 11) {
    sMask = [/[0-9]/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
  }

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      value={value}
      mask={sMask}
      placeholderChar={'\u2000'}
      showMask
    />
  )
}

formatCpfCnpj.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

function formatCelular(props) {
  const { inputRef, value, ...other } = props

  let valor = value
  if (!valor) {
    valor = ''
  }

  const clearValue = clearNumber(value)
  let sMask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/]
  if (clearValue.length > 10) {
    sMask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  }

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      value={valor}
      mask={sMask}
      placeholderChar={'\u2000'}
      showMask
    />
  )
}

formatCelular.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

function formatCep(props) {
  const { inputRef, value, ...other } = props

  let valor = value
  if (!valor) {
    valor = ''
  }

  const sMask = [/[1-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      value={valor}
      mask={sMask}
      placeholderChar={'\u2000'}
      showMask
    />
  )
}

formatCep.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  withoutLabel: {
    marginTop: theme.spacing(1),
  },
  textField: {
    marginBottom: '1px',
  },
  image: {
    position: 'absolute',
    top: 110,
    left: 50,
  },
  img: {
    display: 'block',
    width: '120px',
    height: '120px',
    borderRadius: 15,
  },
  status: {
    position: 'absolute',
    top: 110,
    left: 170,
  },
  estado: {
    position: 'absolute',
    top: 225,
    left: 30,
    fontSize: '12px',
  },
  botoes: {
    position: 'absolute',
    top: 100,
    right: 100,
  },
  botoesvei: {
    position: 'absolute',
    top: 110,
    right: 32,
  },
}))

const Cadastro = ({ isShowPedido, hide, tipo, pedidoId }) => {
  const classes = useStyles()
  const formRef = useRef(null)

  const [initialValues, setInitialValues] = useState({
    pedido: pedidoId,
  })

  const [value, setValue] = useState(0)
  const [disableEdit, setDisableEdit] = useState(false)
  const [tipoCad, setTipoCad] = useState(tipo)
  const [tipoCadVei, setTipoCadVei] = useState('')
  const [tipoCadastro, setTipoCadastro] = useState('')
  // const [modo, setModo] = useState('')

  const style = {
    background: "#FFF",
    borderRadius: "0.25rem",
    padding: "20px",
    boxShadow:
      "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)"
  };

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    try {

      // console.log('**** Inicio', tipoCad, pedidoId)
      if (tipoCad !== 'N' && tipoCad !== 'E') {
        setDisableEdit(true)
      }

      if (pedidoId !== null && tipoCad !== 'N') {
        // console.log('**** buscaPedido')
        buscaPedido()
      }

      if (tipoCad === 'N' && tipoCadastro === '') {
        setTipoCadastro('M')
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response
        data.map(mensagem => {
          toast(mensagem.message, { type: 'error' })
        })
      } else if (error.request) {
        toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
        toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    }
  }, [pedidoId, tipoCad, disableEdit])

  const buscaPedido = async () => {
    if (pedidoId) {
      const data = dadosCadastro

      data.limitecoleta = data.limitecoleta ? data.limitecoleta.substring(0, 10) : null
      data.limiteentrega = data.limiteentrega ? data.limiteentrega.substring(0, 10) : null

      // setInitialValues(data)
      setTipoCadastro(data.tipo)
      // setVeiculos(data.veiculos)
    }
  }
  
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  async function handleSubmit (data, { reset }) {
    try {
      
      console.log('**** data', data)

      const schema = Yup.object().shape({
        id: Yup.string().required('O pedido é obrigatório'),
        // email: Yup.string()
        //   .email('Digite um email válido')
        //   .required('O email é obrigatório')
        //   .min(3, 'No mínimo 3 caracteres'),
      })

      await schema.validate(data, {
        abortEarly: false,
      })
      
      formRef.current.setErrors({})
      reset()
      
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {}

        err.inner.forEach(error => {
          errorMessages[error.path] = error.message
        })

        formRef.current.setErrors(errorMessages)
        // Object.keys(errorMessages).map(key => formRef.current.setFieldError(key, errorMessages[key]))
      }
    }
  }

  if (isShowPedido) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal">
            <Container>

              <Form ref={formRef} onSubmit={handleSubmit} height={'490px'} initialData={initialValues}>

                <Tabs value={value} onChange={handleChange} aria-label="Dados do Pedido">
                  <Tab label="Pedido" {...a11yProps(0)} />
                  <Tab label="Veículos" {...a11yProps(1)} />
                </Tabs>

                {!disableEdit &&
                  <div className={classes.botoes}>
                    <button type="submit">Salvar</button>
                  </div>
                }

                <TabPanel
                  value={value}
                  index={0}
                  id='cadPed'
                >
                  <Grid fluid>
                    <Row>
                      <Col xs={2}>
                        <Input 
                          name="id" 
                          label="Pedido" 
                          type="text"
                          onFocus
                          onBlur
                        />
                      </Col>
                      <Col xs={2}>
                        <Input 
                          name="limitecoleta" 
                          label="Limite Coleta" 
                          type="date"
                          onFocus
                          onBlur
                        />
                      </Col>
                      <Col xs={2}>
                        <Input 
                          name="limiteentrega" 
                          label="Limite Entrega" 
                          type="date"
                          onFocus
                          onBlur
                        />
                      </Col>
                    </Row>
                  </Grid>
                </TabPanel>

                {/* <button type="submit">Enviar</button> */}
              </Form>

            </Container>
          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default Cadastro