function updateNameRubric (rubrics, id, name) {
  for (const item of rubrics) {
    if(item.id == id){
      item.name = name;
      break;
    }
  }
}

function addNewRubric (rubrics, newRubric) {
  for (const item of rubrics) {
    if(item.id == newRubric.id_parent){
      item.deletable = false;
      item.sublevel = true;
      break;
    }
  }
  newRubric.deletable = true;
  newRubric.sublevel = false;
  rubrics.push(newRubric);
}

function rubricSublevels (rubrics) {
  for (const item of rubrics) {
    let sl = false;
    for (const itm of rubrics) {
      if (item.id == itm.id_parent) {
        sl = true;
        break;
      }
    }
    item.sublevel = sl;
    item.deletable = (item.deletable == 1 || item.deletable === true) ? true : false;
  }
}

function beginRContext (rubrics, choosenRubrics) {
  let ans = [];
  for(const idItem of choosenRubrics){
    let id = search(rubrics, idItem).id_parent;
    while(id != 0){
      ans[id] = true;
      id = search(rubrics, id).id_parent;
    }
  }
  return ans;
}

function search(data, id, index = false) {
  if (data && id) {
    for (const key in data) {
      if (data[key].id == id) {
        return index ? key : data[key];
      }
    }
  }
  return null;
}

function getShownRubricsIds(rubrics, id) {
  let answer = [id];
  for (const item of rubrics) {
    if (item.id_parent == id) {
      answer.push( ...getShownRubricsIds(rubrics, item.id) );
    }
  }
  return answer;
}

function gluing(wasAtc, newAtc) {
  const exceptAtc = [];
  for (const item of newAtc) {
    const link = search(wasAtc, item.id);
    if (link) {
      exceptAtc.push(link);
    }
  }
  const answer = arrDifference(wasAtc, exceptAtc);
  answer.push(...newAtc);
  return answer;
}

// Віднімаємо масив arrB від массиву arrA
function arrDifference(arrA, arrB) { return arrA.filter(x => !arrB.includes(x)) };

// Перетин масивів arrA та arrB
function arrIntersection(arrA, arrB) { return arrA.filter(x => arrB.includes(x)) };

const AppContext = React.createContext();
const RubricContext = React.createContext();

const Modal = ({
                 visible = false,
                 title = '',
                 content = '',
                 footer = '',
                 onClose,
             }) => {

  const [context, setContext] = React.useContext(AppContext);

  const onKeydown = ({key}) => {
      switch (key) {
          case 'Escape':
              onClose()
              break
      }
  }

  React.useEffect(() => {
      document.addEventListener('keydown', onKeydown)
      return () => document.removeEventListener('keydown', onKeydown)
  })

  if (!visible) return null;

  return <div className="rmodal" onClick={onClose}>
      <div Style={context.wideModal ? 'max-width: 990px;' : 'max-width: 550px;'} className="rmodal-dialog" onClick={e => e.stopPropagation()}>
          <div className="rmodal-header">
              <h3 className="rmodal-title">{title}</h3>
              <span className="rmodal-close" onClick={onClose}>
          &times;
        </span>
          </div>
          <div className="rmodal-body">
              <div Style={context.wideModal ? 'height: 60vh;' : ''} className="rmodal-content">{content}</div>
          </div>
          {footer && <div className="rmodal-footer">{footer}</div>}
      </div>
  </div>
}

const Rubric = ({
                  id = 0,
                  name = '',
                  id_parent = 0,
                  deletable = false,
                  sublevel = false,
                  mch = false,
                }) => {
  
  const [context, setContext] = React.useContext(AppContext);
  const [isChoosen, setChoosen] = React.useState(mch ? context.choosenRubrics.indexOf(id) != -1 : context.choosenRubric == id);
  const [rContext, setRContext] = React.useContext(RubricContext);

  const addRubric = () => {
    setContext({
      ...context,
      isModal: true,
      newItem: {id_parent: id},
      action: 'add',
    })
  }

  const updateRubric = () => {
    setContext({
      ...context,
      isModal: true,
      newItem: {id: id, name: name, id_parent: id_parent},
      action: 'update',
    })
  }

  const deleteRubric = () => {
    setContext({
      ...context,
      isModal: true,
      newItem: {id: id, name: name},
      action: 'delete',
    })
  }

  const replaceChoose = () => {
    let s = new Set(context.choosenRubrics);
    if(isChoosen) {
      setChoosen(false);
      s.delete(id);
      setContext({
        ...context,
        choosenRubrics: [...s]
      })
    } else {
      setChoosen(true)
      s.add(id);
      setContext({
        ...context,
        choosenRubrics: [...s]
      })
    }
  }

  const choose = () => {
    if(context.choosenRubric != id) {
      const shownRubricsAtc = getShownRubricsIds(context.rubricsData, id);
      const loadableAtc = arrDifference(shownRubricsAtc, context.loadedAtc);
      let loading = {};
      if (loadableAtc.length > 0) {
        loading = {
          requestAtc: true,
          action: 'readAtc',
        }
      }
      setContext({
        ...context,
        choosenRubric: id,
        shownRubricsAtc: shownRubricsAtc,
        loadableAtc: loadableAtc,
        ...loading,
      })
    }
  }

  const setOpen = (st) => {
    let rc = rContext.slice();
    rc[id] = st;
    setRContext(rc);
  }

  const replaceOpen = () => {
    if(rContext[id]) {setOpen(false)} else {setOpen(true)}
  }

  const editing = !mch;

  return (
    <div className={'rubric-block' + ( sublevel ? ' opening' : '' )}>
      <div className={'rubric' + (id_parent == 0 ? ' rubric-root' : '')}>
        {sublevel ? <span onClick={replaceOpen} className = "open">{rContext[id] ? '-' : '+'}</span> : null}
        <span onClick={mch ? replaceChoose : choose} className={'rubric-name' + ((mch ? isChoosen : context.choosenRubric == id) ? ' choosen' : '')}>
          {name}
        </span>
        {editing ? 
          <span className="rubric-btns">
            <span className="btn-add" onClick={addRubric}></span>
            <span className="btn-update" onClick={updateRubric}></span>
            {deletable ? <span className="btn-delete" onClick={deleteRubric}></span> : null}
          </span>
        : null}
      </div>
      {rContext[id] ? <RubricsLevel idParent = {id} mch = {mch} /> : null}
    </div>
  );
}

const RubricsLevel = ({idParent = 0, mch = false}) => {
  const [context, setContext] = React.useContext(AppContext);
  return (
    <React.Fragment>
        {context.rubricsData.map(item => (
          idParent == item.id_parent ?
            <Rubric 
              id = {item.id}
              name = {item.name}
              id_parent = {item.id_parent}
              deletable = {item.deletable}
              sublevel = {item.sublevel}
              mch = {mch}
            /> :
          null
        ))}
    </React.Fragment>
  );
}

const Rubrics = ({mch = false, beginRContext = []}) => {
  const [rContext, setRContext] = React.useState(beginRContext);
  const [context, setContext] = React.useContext(AppContext);
  if (context.rubricsData) {
    return (
      <RubricContext.Provider value={[rContext, setRContext]}>
        <React.Fragment>
          <RubricsLevel mch={mch} />
          {!mch ? <ConnectRubricAPI/> : null}
        </React.Fragment>
      </RubricContext.Provider> 
    );
  } else {
    return null;
  }    
}

function ConnectRubricAPI() {
  const [error, setError] = React.useState(null);
  const [context, setContext] = React.useContext(AppContext);
  const [rContext, setRContext] = React.useContext(RubricContext);

  if(context.request) {

    let params = { credentials: 'same-origin',
                   headers: { 'Content-Type': 'application/json;charset=utf-8' },
                  };
    let req = '/api/rubrics';

    switch (context.action) {
      case 'view':
        req += '/receive'; 
        params = {
          ...params,
          method: 'GET',
          };
        break;
      case 'update':
        req += '/update?id=' + context.newItem.id; 
        params = {
          ...params,
          method: 'PUT',
          body: JSON.stringify(context.newItem)
          };
        break;
      case 'add':
        params = {
          ...params,
          method: 'POST',
          body: JSON.stringify(context.newItem),
          };
        break;
      case 'delete':
        req += '/' + context.newItem.id;
        params = {
          ...params,
          method: 'DELETE',
          };
        break;
    }
    
    const finReq = (rubrData) => {
      setContext({
        ...context,
        request: false,
        rubricsData: rubrData
      });
    }

    fetch(req, params)
      .then(res => {  
                      setContext({
                        ...context,
                        request: false,
                      });

                      if (context.action != 'delete') {
                        return res.json();
                      }
                  })
      .then(
        (result) => {
          switch (context.action) {
            case 'view':
              rubricSublevels(result);
              finReq(result);
              break;
            case 'update':
              let updRub = context.rubricsData.slice();
              updateNameRubric(updRub, result.id, result.name);
              finReq(updRub);
              break;
            case 'add':
              let addedRub = context.rubricsData.slice();
              addNewRubric(addedRub, result);
              finReq(addedRub);
              let rc = rContext.slice();
              rc[result.id_parent] = true;
              setRContext(rc);
              break;
            case 'delete':
              setContext({
                ...context,
                request: true,
                action: 'view'
              });
              break;
          }
        },
        (error) => {
          setError(error);
          setContext({
            ...context,
            request: false,
          });
        }
      )
    
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (context.request) {
    return <div className="spinner"><img src="/img/spinner.gif"/></div>;
  } else {
    return null;
  }
}

function ConnectAtcAPI() {
  const [error, setError] = React.useState(null);
  const [context, setContext] = React.useContext(AppContext);

    if(context.requestAtc) {
      
      let params = { credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    };
      let req = '/api/posts';

      switch (context.action) {
        case 'readAtc':
          req += '/read'; 
          params = {
            ...params,
            method: 'POST',
            body: JSON.stringify({id_rubrics: context.shownRubricsAtc}),
            };
          break;
        case 'updateAtc':
          req += '/update?id=' + context.newItem.id; 
          params = {
            ...params,
            method: 'PUT',
            body: JSON.stringify(context.newItem),
            };
          break;
        case 'addAtc':
          params = {
            ...params,
            method: 'POST',
            body: JSON.stringify(context.newItem),
            };
          break;
        case 'deleteAtc':
          req += '/' + context.newItem.id;
          params = {
            ...params,
            method: 'DELETE',
            };
          break;
      }
      
      const finReq = (data) => {
        setContext({
          ...context,
          requestAtc: false,
          atcData: data
        });
      }

      fetch(req, params)
        .then(res => {  
                        setContext({
                          ...context,
                          requestAtc: false,
                        });

                        if (context.action != 'deleteAtc') {
                          return res.json();
                        }
                    })
        .then(
          (result) => {
            switch (context.action) {
              case 'readAtc':
                const newlyAtc = gluing(context.atcData, result);
                setContext({
                  ...context,
                  requestAtc: false,
                  atcData: newlyAtc,
                });
                break;
              case 'updateAtc':
                const updAtc = context.atcData.slice();
                updAtc[search(updAtc, context.newItem.id, true)] = {...context.newItem};
                setContext({
                  ...context,
                  requestAtc: false,
                  atcData: updAtc,
                });
                break;
              case 'addAtc':
                const rubrics = context.rubricsData.slice();
                rubrics.forEach((item)=>{
                  if( context.newItem.id_rubrics.indexOf(item.id) != -1 ){
                    item.deletable = false;
                  }
                });
                const addedAtc = context.atcData.slice();
                addedAtc.push({...context.newItem, id: result.id, id_user: result.id_user});
                setContext({
                  ...context,
                  requestAtc: false,
                  atcData: addedAtc,
                  idCurrentAtc: result.id,
                  rubricsData: rubrics,
                  choosenRubric: null,
                  user: null,
                });
                break;
              case 'deleteAtc':
                setContext({
                  ...context,
                  request: true,
                  requestAtc: false,
                  idCurrentAtc: null,
                  action: 'view'
                });
                break;
            }
          },
          (error) => {
            setError(error);
            setContext({
              ...context,
              requestAtc: false,
            });
          }
        )
      
    }
  return <Spiner error={error}  requestAtc={context.requestAtc}/>;
}

const Spiner = ({error, requestAtc}) => {
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (requestAtc) {
    return <div className="spinner"><img src="/img/spinner.gif"/></div>;
  } else {
    return null;
  }
}

const InputField = ({ type, label, value, onChange, errorValid }) => (
  <label>
    <div>{label} <span className = "not-valid">{errorValid}</span></div>
    { type == 'textarea' ? 
    <textarea value={value} onChange={e => onChange(e.target.value)}></textarea> : 
    <input type={type} value={value} onChange={e => onChange(e.target.value)} /> }
  </label>
);

const Form = ({ fields, onSubmit, id = '' }) => {
  let beginData = {};
  let beginReq = {};
  let beginErrorValid = {};
  fields.forEach(item => {
    Object.assign(beginData, {[item.name]: item.value});
    Object.assign(beginReq, {[item.name]: item.required});
    Object.assign(beginErrorValid, {[item.name]: ''});
  })
  const [data, setData] = React.useState(beginData);
  const [required, setRequired] = React.useState(beginReq);
  const [errorValid, setErrorValid] = React.useState(beginErrorValid);

  const handleSubmit = e => {
    e.preventDefault();
    let sbmt = true;
    for (const field in required) {
      if (required[field] && data[field] == '' ) {
        setErrorValid({
          ...errorValid,
          [field]: 'Required field'
        });
        sbmt = false;
      }
    }
    if (sbmt) onSubmit(data);
  };

  const handleChange = fieldName => fieldValue => {
    setData({
      ...data,
      [fieldName]: fieldValue,
    });
  };

  return (
    <form id={id} onSubmit={handleSubmit}>
      {fields.map((item) => (
        <InputField
          type={item.type}
          label={item.label}
          value={data[item.name]}
          onChange={handleChange(item.name)}
          errorValid={errorValid[item.name]}
        />
      ))}
    </form>
  );
};

const Users = () => {
  return (
    <React.Fragment>
      {initUsers.map(user => (
        <User
          id={user.id}
          username={user.username}
        />
      ))}
    </React.Fragment>
  );
}

const User = ({id, username}) => {
  const [context, setContext] = React.useContext(AppContext);
  const choice = () => {
    if(context.user != id) {
      setContext({
        ...context,
        user: id
      })
    }
  }
  return (
    <div className={'user' + (context.user == id ? ' choosen' : '')} onClick={choice}>{username}</div>
  );
}

const CurrentArticle = () => {
  const [context, setContext] = React.useContext(AppContext);
  const atc = search(context.atcData, context.idCurrentAtc);
  if (!atc) return null;
  return (
    <React.Fragment>
      <div className="author">Author: <span>{search(initUsers, atc.id_user).username}</span></div>
      <h5 className="title-atc">{atc.title}</h5>
      <div>{atc.content}</div>
    </React.Fragment>
  );
}

const Article = ({id, title}) => {
  const [context, setContext] = React.useContext(AppContext);
  const choice = () => {
    if(context.idCurrentAtc != id) {
      setContext({
        ...context,
        idCurrentAtc: id,
      })
    }
  }
  return (
    <div className={'article' + (context.idCurrentAtc == id ? ' choosen' : '')} onClick={choice}>{title}</div>
  );
}

const Articles = () => {
  const [context, setContext] = React.useContext(AppContext);
  return (
    <React.Fragment>
      {context.atcData.map(item =>
        {return arrIntersection(context.shownRubricsAtc, item.id_rubrics).length > 0 && (context.user == item.id_user || !context.user) ? <Article id={item.id} title={item.title} /> : null }
      )}
      <ConnectAtcAPI/>
    </React.Fragment>
  );
}

const App = () => {
  const [errorMes, setErrorMes] = React.useState(null);
  const [context, setContext] = React.useState({
                                                request: true,
                                                requestAtc: false,
                                                isModal: false,
                                                wideModal: false,
                                                rubricsData: [],
                                                choosenRubrics: [],
                                                choosenRubric: null,
                                                newItem: {},
                                                action: 'view', /* update, add, delete, readAtc, addAtc, updateAtc, deleteAtc */
                                                user: null,
                                                atcData: [],
                                                idCurrentAtc: null,
                                                loadedAtc: [],
                                                shownRubricsAtc: [],
                                                loadableAtc: [],
                                              })

  const onClose = () => {
    setContext({
      ...context,
      action: 'view',
      isModal: false,
      wideModal: false,
    })
  }

  const addRootRubric = () => {
    setContext({
      ...context,
      isModal: true,
      newItem: {id_parent: 0},
      action: 'add',
    })
  }

  const clearAuthors = () => {
    setContext({
      ...context,
      user: null,
    })
  }

  const addArticle = () => {
    setContext({
      ...context,
      isModal: true,
      wideModal: true,
      action: 'addAtc',
    })
  }

  const updateArticle = () => {
    const newItem = {...search(context.atcData, context.idCurrentAtc)};
    setContext({
      ...context,
      isModal: true,
      wideModal: true,
      choosenRubrics: newItem.id_rubrics.slice(),
      action: 'updateAtc',
      newItem: newItem,
    })
  }

  const deleteArticle = () => {
    setContext({
      ...context,
      isModal: true,
      action: 'deleteAtc',
    })
  }

  const submitAdd = (data) => {
    setContext({
      ...context,
      newItem: Object.assign(context.newItem, data, {id: ''}),
      isModal: false,
      request: true,
    })
  }

  const submitUpdate = (data) => {
    setContext({
      ...context,
      newItem: Object.assign(context.newItem, data),
      isModal: false,
      request: true,
    })
  }

  const submitDelete = () => {
    setContext({
      ...context,
      isModal: false,
      request: true,
    })
  }

  const submitAddAtc = (data) => {
    if (context.choosenRubrics.length == 0) {
      setErrorMes('Choose at least one rubric');
      return null;
    }
    setContext({
      ...context,
      newItem: {...data, id_rubrics: context.choosenRubrics.slice()},
      isModal: false,
      wideModal: false,
      requestAtc: true,
      choosenRubrics: [],
    })
  }

  const submitUpdateAtc = (data) => {
    if (context.choosenRubrics.length == 0) {
      setErrorMes('Choose at least one rubric');
      return null;
    }
    setContext({
      ...context,
      newItem: {...context.newItem, ...data, id_rubrics: context.choosenRubrics},
      isModal: false,
      wideModal: false,
      requestAtc: true,
      choosenRubrics: [],
    })
  }

  const submitDeleteAtc = () => {
    setContext({
      ...context,
      newItem: {id: context.idCurrentAtc},
      isModal: false,
      requestAtc: true,
    })
  }

  let modalProps = {};
  switch (context.action) {
    case 'view':
      break;
    case 'update':
      modalProps = {
        title: 'Update Rubric',
        content: <Form
                  fields= {[{
                    type:'text',
                    label:'Name of rubric',
                    name:'name',
                    value: context.newItem.name,
                    required: true
                  }]}
                  onSubmit = {submitUpdate}
                  id = 'update-form'
                />,
        footer: <button form="update-form" type="submit" className="btn btn-success">Save</button>
      }
      break;
    case 'add':
      modalProps = {
        title: 'New Rubric',
        content: <Form
                  fields= {[{
                    type:'text',
                    label:'Name of new rubric',
                    name:'name',
                    value:'',
                    required: true
                  }]}
                  onSubmit = {submitAdd}
                  id = 'add-form'
                />,
        footer: <button form="add-form" type="submit" className="btn btn-success">Save</button>
      }
      break;
    case 'delete':
      modalProps = {
        title: 'Delete Rubric',
        content: (<div>
                  DELETE rubric "{context.newItem.name}"?
                </div>),
        footer: (<div><button onClick={submitDelete} className="btn btn-primary">Ok</button><button onClick={onClose} className="btn btn-secondary">Cancel</button></div>)
      }
      break;
    case 'addAtc':
      modalProps = {
        title: 'New Article',
        content: (
                <div className="formAtc">
                  <div>
                    <Rubrics
                      mch={true}
                    />
                  </div>
                  <Form
                    fields= {[{
                      type:'text',
                      label:'Title',
                      name:'title',
                      value:'',
                      required: true
                    }, {
                      type:'textarea',
                      label:'Content',
                      name:'content',
                      value:'',
                      required: true
                    }]}
                    onSubmit = {submitAddAtc}
                    id = 'add-atc-form'
                  />
                </div>),
        footer: ( <div>
                  <div className="error">{errorMes} </div>
                  <button form="add-atc-form" type="submit" className="btn btn-success">Save</button>
                  </div> )
      }
      break;
    case 'updateAtc':
      modalProps = {
        title: 'Update Article',
        content: (
                <div className="formAtc">
                  <div>
                    <Rubrics
                      mch={true}
                      beginRContext={beginRContext(context.rubricsData, search(context.atcData, context.idCurrentAtc).id_rubrics)}
                    />
                  </div>
                  <Form
                    fields= {[{
                      type:'text',
                      label:'Title',
                      name:'title',
                      value: context.newItem.title.slice(),
                      required: true
                    }, {
                      type:'textarea',
                      label:'Content',
                      name:'content',
                      value: context.newItem.content.slice(),
                      required: true
                    }]}
                    onSubmit = {submitUpdateAtc}
                    id = 'update-atc-form'
                  />
                </div>),
        footer: ( <div>
                  <div className="error">{errorMes} </div>
                  <button form="update-atc-form" type="submit" className="btn btn-success">Save</button>
                  </div> )
      }
      break;
    case 'deleteAtc':
      modalProps = {
        title: 'Delete Article',
        content: (<div>
                  DELETE article "{search(context.atcData, context.idCurrentAtc).title}"?
                </div>),
        footer: (<div><button onClick={submitDeleteAtc} className="btn btn-primary">Ok</button><button onClick={onClose} className="btn btn-secondary">Cancel</button></div>)
      }
      break;
  }
  return (
      <AppContext.Provider value={[context, setContext]}>
          <Modal
              visible={context.isModal}
              title={modalProps.title}
              content={modalProps.content}
              footer={modalProps.footer}
              onClose={onClose}
          />
          <div class="basis">
            <div class="sub-basis">
              <h4>Rubrics {isL ? <span className="btn-add" onClick={addRootRubric}></span> : null}</h4>
              <div class="space">
                <Rubrics
                  mch={false}
                />
              </div>
            </div>
            <div class="sub-basis">
              <div class="subh-basis">
                <div class="subw-basis">
                  <div class="subhh-basis">
                  <div class="subww-basis authors">
                      <h4>Authors <span className="btn-clear" onClick={clearAuthors}></span></h4>
                      <div class="space">
                        <Users/>
                      </div>
                    </div>
                    <div class="subww-basis">
                      <h4>Articles</h4>
                      <div class="space">
                        <Articles/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="subw-basis">
                  <h4>Article 
                    { isL ? <span className="btn-add" onClick={addArticle}></span> : null }
                    { context.idCurrentAtc && !context.requestAtc && isL ?
                      <React.Fragment>
                        <span className="btn-update" onClick={updateArticle}></span>
                        <span className="btn-delete" onClick={deleteArticle}></span>
                      </React.Fragment>
                      : null }
                  </h4>
                  <div class="space">
                    <CurrentArticle/>
                  </div>
                </div>
              </div>
            </div> 
          </div>   
      </AppContext.Provider>
  );
};

ReactDOM.render(
      <App/>,
  document.getElementById('root')
);

