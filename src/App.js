import { useState ,useEffect, useRef } from "react";

function App({questions}){
  const [index,setIndex] = useState(0)
  const [isQuizEnded,setIsQuizEnded] = useState(false)
  const ans          = useRef({correct:0,wrong:0})
  const el          = useRef(null)
  const timer       = useRef({id1:null,id2:null})
  const progressEl  = useRef(null)

  const containerStyle = {
    width:"90%",
    display:"flex",
    position:"relative",
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    border:"1px solid grey",
    borderTop:"",
    margin:"auto",
    borderRadius:"5px",
    marginTop:50,
    left:"20px",
    opacity:0
  }

  const infoStyle ={
  margin:"2px 2px 2px 2px",
   flexGrow:0,
   //transform:"translateY(-50%)"
  }

  const progressStyle = {
    margin:"2px 2px 2px 2px",
    flexGrow:1,
    border:"1px solid grey"
  }
  
  useEffect(()=>{
    setTimeout(()=>{
      el.current.style.transition = "left 1s ease-in-out ,opacity 1s ease-in-out"
      el.current.style.left = "0px"
      el.current.style.opacity = "1"
    },0)

    timer.current.id2 = setTimeout(()=>{
      progressEl.current.style.transition = "width 4s linear"
      progressEl.current.style.width = "100%"
    },1000)
   

   timer.current.id1=  setTimeout(()=>{
    if(index+1 === questions.length) setIsQuizEnded(true)
    else setIndex(i=>i+1)  

    },5000)

    return ()=>{
      progressEl.current.style.width = "0%"
      progressEl.current.style.transition = ""
      el.current.style.left = "20px"
      el.current.style.opacity = "0"
      el.current.style.transition = ""
      clearTimeout(timer.current.id1)
      clearTimeout(timer.current.id2)

    }

  },[index])



  const handleResponse = (response)=>{
    if(response) ans.current.correct++
    else ans.current.wrong++
    
    if(index+1 === questions.length) setIsQuizEnded(true)
    else setIndex(i=>i+1)
    
  }

  return (
    <>
    {
      isQuizEnded ?
      <ShowResult ans={ans.current} total={questions.length} />
      :
     <div ref={el} style={containerStyle}>
      
      <div style={infoStyle}>{index+1}/{questions.length}</div>
     
     <div style={{...progressStyle,backgroundColor:"white"}}>
      <div ref={progressEl} style={{height:"3px",width:"0%",backgroundColor:"red" }}></div>
    </div>
     
      <ShowQA ques={questions[index]} handleResponse={handleResponse} />

     </div>
    }
    </>
  )

}

function ShowQA({ques,handleResponse}){

  const clickHandler = (response)=>{
    handleResponse(response)
  }

  const questionStyle = {
    flex:"96%",
    margin:"2%"
  }
  const buttonStyle = {
    flex:"40%",
    margin:"2%",
    padding:"2%",
    
  }

  return (
    <>
      <p style={questionStyle}><span style={{color:"red"}}>Q </span>{ques.question}</p>
      {
        ques.answers.map((ans,i)=>{
          return <button style={buttonStyle}
            key={i}
            onClick={()=>clickHandler(i===ques.correctAnsIndex)}>
            {ans}
            </button>
        })
      }
    </>
  )
}

function ShowResult({ans,total}){
  
  const [showResultNumbers,setResultNumbers] = useState(false)

  const elRight  = useRef(null)
  const elWrong  = useRef(null)
  const elNotAttempted  = useRef(null)

  const {correct,wrong} = ans
  const notAttempted = total-correct-wrong
  const percent = {
    correct : correct*100/total,
    wrong   : wrong*100/total,
    notAttempted : notAttempted*100/total
  }

  useEffect(()=>{
    const factor = 20
    setTimeout(()=>{
      elRight.current.style.transition = `width ${percent.correct*factor}ms linear`
      elRight.current.style.width = "100%"
    },0)

    setTimeout(()=>{
      elWrong.current.style.transition = `width ${percent.wrong*factor}ms linear`
      elWrong.current.style.width = "100%"
    },percent.correct*factor)
    
    setTimeout(()=>{
      elNotAttempted.current.style.transition = `width ${percent.notAttempted*factor}ms linear`
      elNotAttempted.current.style.width = "100%"
    },(percent.correct+percent.wrong)*factor)
   
    setTimeout(()=>{
      setResultNumbers(true)
    },(percent.correct+percent.wrong+percent.notAttempted)*factor)

  })

  const containerStyle={
    display:"flex",
    width:"90%",
    flexDirection:"row",
    flexWrap:"wrap",
    margin:"2%",
    padding:"1%",
    justifyContent:"space-between",
    borderRadius:"5px",
    border:"1px solid grey"
  }
  const infoStyle = {
    margin:"14px 2px 14px 2px",
    padding:4,
    borderLeft : "6px solid grey",
  }

  const graphStyle = {
    height:10,
    backgroundColor:"white"
  }

  return <div style={containerStyle}>
    <h1 style={{flex:"100%",textAlign:"center",margin:10,color:"grey"}}>Result</h1>
      <div style={{...graphStyle,flex:`${percent.correct}%`}}>
        <div ref={elRight} style={{width:"0%",height:"100%",backgroundColor:"green",}}></div>
      </div>
      <div style={{...graphStyle,flex:`${percent.wrong}%`}}>
        <div ref={elWrong} style={{width:"0%",height:"100%",backgroundColor:"red"}}></div>
      </div>
      <div style={{...graphStyle,flex:`${percent.notAttempted}%`}}>
        <div ref={elNotAttempted} style={{width:"0%",height:"100%",backgroundColor:"grey"}}></div>
      </div>{
       showResultNumbers && [
      <div style={{...infoStyle,borderColor:"green"}}>{correct} Right</div>,
      <div style={{...infoStyle,borderColor:"red"}}>{wrong} Wrong</div>,
      <div style={{...infoStyle,}}>{notAttempted} Not Attempted</div>
        ]
      }
  </div>
}

const questionArray = [
  {
    question: "What is the largest planet in our solar system?",
    answers: ["Jupiter", "Mars", "Saturn", "Neptune"],
    correctAnsIndex: 0
  },
  {
    question: "Which gas makes up the majority of Earth's atmosphere?",
    answers: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Methane"],
    correctAnsIndex: 2
  },
  {
    question: "What is the phenomenon that traps heat in the Earth's atmosphere?",
    answers: ["Greenhouse effect", "Ozone depletion", "Acid rain", "El Niño"],
    correctAnsIndex: 0
  },
  {
    question: "Which of the following is a renewable source of energy?",
    answers: ["Coal", "Natural Gas", "Solar power", "Nuclear power"],
    correctAnsIndex: 2
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnsIndex: 3
  },
  {
    question: "Which of the following is a greenhouse gas?",
    answers: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"],
    correctAnsIndex: 1
  },
  {
    question: "Which space agency successfully landed the first humans on the moon?",
    answers: ["NASA", "ESA", "ISRO", "Roscosmos"],
    correctAnsIndex: 0
  },
  {
    question: "What is the name of the largest known asteroid in our solar system?",
    answers: ["Ceres", "Vesta", "Eros", "Venus"],
    correctAnsIndex: 0
  },
  {
    question: "What causes the tides on Earth?",
    answers: ["Gravity from the sun", "Rotation of the Earth", "Gravity from the moon", "Global warming"],
    correctAnsIndex: 2
  },
  {
    question: "What is the process by which plants convert sunlight into energy?",
    answers: ["Photosynthesis", "Respiration", "Fertilization", "Transpiration"],
    correctAnsIndex: 0
  }
]

export default ()=><App questions={questionArray} />;




                  