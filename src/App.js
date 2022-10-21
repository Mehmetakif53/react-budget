import './App.css';
import React, {useState, useEffect} from 'react';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Alert from './components/Alert';
import { v4 as uuid } from 'uuid';



// const initialExpenses = [
//   {id:uuid(), charge:"rent", amount:1600},
//   {id:uuid(), charge:"car payment", amount:400},
//   {id:uuid(), charge:"credit card bill", amount:1200},
// ];
const initialExpenses =localStorage.getItem("expenses")
? JSON.parse(localStorage.getItem("expenses"))
: [];

function App() {
  const [expenses, setExpenses] = useState(initialExpenses);
  
  const [charge, setCharge] = useState("");

  //single amount
  const [amount, setAmount] = useState("");
  
  //alert
  const[alert, setAlert] = useState({ show: false })

  //edit
  const [edit,setEdit] = useState(false)

  //edit item
  const [id,setId] = useState(0)


  //useEffect
  useEffect(()=> {
    console.log("we called useEffect")
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

   //handleCharge

  const handleCharge = e => { 
    setCharge (e.target.value)
  };

  //handleAmount
  
  const handleAmount = e => {
    setAmount (e.target.value)
  };


  //handleAlert

  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 2000);
  };


  //handleSubmit

  const handleSubmit = e => {
    e.preventDefault();
   if(charge !=="" && amount > 0) {

if(edit) {
  let tempExpenses =expenses.map(item => {
    return item.id ===id? {...item, charge, amount} : item;
  })
  setExpenses(tempExpenses);
  setEdit(false)
  handleAlert({ type:"success", text: "öğe düzenlendi"});

} else {
    const singleExpense = {id:uuid(), charge,amount}
    setExpenses([...expenses, singleExpense])
    handleAlert({ type:"success", text: "Öğe Eklendi" });
}
      setCharge("") 
      setAmount("")    
   } else {

    //HandleAlexrt
    handleAlert({
      type: "danger",
      text: `Ücret Boş Değer Olmaz ve Tutar Değeri Sıfırdan Büyük Olmalıdır`
      });
    }
  };

    //clear all items
    const clearItems = () => {  
      setExpenses([])
      handleAlert({type: "danger", text: "Tüm Öğeler Silindi"})
    }  

    //handle delete
    const handleDelete = id => {
      let tempExpenses = expenses.filter(item => item.id !==id)
      setExpenses(tempExpenses)
      handleAlert({type: "danger", text: "Öğe Silindi"})
    }

    //handle edit
    const handleEdit = id => {
      let expense =expenses.find(item => item.id ===id)
      let {charge,amount} = expense;
      setCharge(charge)
      setAmount(amount)
      setEdit(true)
      setId(id)
    }

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert/>
      
      <h1>budget calculator</h1>
      <main className='App'>
        <ExpenseForm 
          charge={charge} 
          amount={amount} 
          handleAmount={handleAmount} 
          handleCharge={handleCharge} 
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList 
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />    
      </main>
        <h1>
          Total Spending: {" "}
            <span className='total'>
                $ {" "}
                {expenses.reduce((acc, curr) => {
                  return (acc += parseInt(curr.amount));
                }, 0)}
            </span>
        </h1>
    </>
  );
}

export default App;
