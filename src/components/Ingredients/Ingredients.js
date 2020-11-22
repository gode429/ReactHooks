import React,{useState, useEffect, useCallback, useReducer, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('should not get there!');
  }
};

// const httpReducer = (currentHttpState, action) => {
//   switch(action.type){
//     case 'SEND':
//       return {loading: true, error: null};
//     case 'RESPONSE':
//       return {...currentHttpState, loading: false};
//     case 'ERROR':
//       return {loading: false, error: action.error};
//       case 'CLEAR':
//         return {...currentHttpState, error: null};
//     default:
//       throw new Error('should not get there!');
//   }
// }

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear } = useHttp();

  useEffect(() => {
    if( !isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT'){
      dispatch({type: 'DELETE', id: reqExtra });
    } else if( !isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD', 
        ingredient: {id: data.name, ...reqExtra}
      })
    }
    
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  //const [httpState, dispatchHTTP] = useReducer(httpReducer, { loading: false, error: null});

  //const [userIngredients , setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  // useEffect(() => {
  //   fetch('https://react-hooks-update-126d7.firebaseio.com/ingredients.json')
  //   .then(response => response.json())
  //   .then(responseData => {
  //     const loadedIngredients = [];
  //     for( const key in responseData){
  //       loadedIngredients.push({
  //         id: key,
  //         title: responseData[key].title,
  //         amount: responseData[key].amount
  //       });
  //     }
  //     setUserIngredients(loadedIngredients);
  //   });
  // }, []);

  const addIngredientHandler = useCallback(ingredient => {
    //setIsLoading(true);
    // dispatchHTTP({type:'SEND'});
    // fetch('https://react-hooks-update-126d7.firebaseio.com/ingredients.json',{
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type':'application/json' }
    // }).then(response => {
    //   //setIsLoading(false);
    //   dispatchHTTP({type:'RESPONSE'});
    //   return response.json();
    // }).then(responseData => {
    //   // setUserIngredients(prevIngredients => [
    //   //   ...prevIngredients, 
    //   //   {id: responseData.name, ...ingredient}
    //   // ]);
    //   dispatch({type:'ADD', ingredient: {id: responseData.name, ...ingredient} });
    // }); 
    sendRequest(
      'https://react-hooks-update-126d7.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    )
  }, [sendRequest]);
  
  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    //setUserIngredients(filteredIngredients);
    dispatch({type:'SET', ingredients: filteredIngredients});
  }, []);

  const removeIngredientHandler = useCallback(id => {
    //setIsLoading(true);
    //dispatchHTTP({type:'SEND'});
    // fetch(`https://react-hooks-update-126d7.firebaseio.com/ingredients/${id}.json`,{
    //   method: 'DELETE',
    // }).then(response => {
    //   //setIsLoading(false);
    //   dispatchHTTP({type:'RESPONSE'});
    //   //const updatedIngredients = userIngredients.filter(ing => ing.id !== id);
    //   //setUserIngredients(updatedIngredients);
    //   dispatch({type:'DELETE', id: id});
    // }).catch(error => {
    //   //setError(error.message);
    //   dispatchHTTP({type:'ERROR', error: error.message});
    // })
    sendRequest ( 
        `https://react-hooks-update-126d7.firebaseio.com/ingredients/${id}.json`,
        'DELETE',
         null,
         id,
         'REMOVE_INGREDIENT'
      );
  }, [sendRequest]);

  // const clearError = useCallback(() => {
  //   //setError(null);
  //   //dispatchHTTP({type: 'CLEAR'})

  // }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
    );
  }, [userIngredients, removeIngredientHandler ]);

  return (
    <div className="App">
      { error && <ErrorModal onClose={clear} > {error} </ErrorModal> }
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadingIngredients = {filteredIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
