import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
  const {onLoadingIngredients} = props;
  const[enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if( enteredFilter === inputRef.current.value ) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest('https://react-hooks-update-126d7.firebaseio.com/ingredients.json'+ query, 'GET');
        // fetch('https://react-hooks-update-126d7.firebaseio.com/ingredients.json'+ query)
        // .then(response => response.json())
        // .then(responseData => {
        //   const loadedIngredients = [];
        //   for( const key in responseData){
        //     loadedIngredients.push({
        //       id: key,
        //       title: responseData[key].title,
        //       amount: responseData[key].amount
        //     });
        //   }
        //   onLoadingIngredients(loadedIngredients);
        // });
      }
    },500);  
// this below return function will run after this if statement and will clear the previous timer before the new one is set
// cleanup will run for the previous effect(whole if stmnt) before the new effect is applied
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, sendRequest , inputRef]);

  useEffect(() => {
    if( !isLoading && !error && data){
      const loadedIngredients = [];
          for( const key in data){
            loadedIngredients.push({
              id: key,
              title: data[key].title,
              amount: data[key].amount
            });
          }
          onLoadingIngredients(loadedIngredients);
        }
  }, [data, isLoading, error, onLoadingIngredients ]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear} > {error} </ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>LOADING...</span>}
          <input type="text" ref={inputRef} value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
