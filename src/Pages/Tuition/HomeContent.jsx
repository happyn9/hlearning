export default function HomeContent({trigger,setModal,setSentence,setSelected}) {

  return (
    <div className="grid lg:grid-cols-[1fr_2fr_2.4fr] gap-6">

      <div className="col-span-2 space-y-8">

        {[
          {title:'Chat'},
          {title:'Sentence Mode'},
          {title:'Word Mode'},
          {title:'Dialogue Mode'}
        ].map((k)=>(
          
          <Card
            key={k.title}
            title={k.title}
            description="Enhance your language skills by chatting with our AI teacher."
            tags={["#Writing","#Reading"]}
            image="/chat.png"
            onClick={()=>trigger(()=>{
              
              switch(k.title){

                case "Sentence Mode":
                  setSentence(true)
                  setModal(false)
                  setSelected(k.title)
                  break

                case "Chat":
                  setModal(true)
                  setSentence(false)
                  break

                default:
                  setModal(false)
                  setSentence(false)

              }

            },900)}
          />

        ))}

      </div>

      {/* RIGHT PANEL */}

      <RightPanel/>

    </div>
  );
}