export default function Title({title}: {title: string}) {
    return(
         <div className="flex flex-row space-x-2 items-center">
                <h2 className="text-2xl text-primary-orange font-bold">{title} </h2>
                <FullLine />
            </div>
    )
}

function FullLine(){
    return(
        <div className="flex">
            <Line classname="bg-green-600 rounded-l-md" />
            <Line classname="bg-primary-orange" />
            <Line classname="bg-black" />
            <Line classname="bg-red-600 rounded-r-md" />
        </div>
    )
}

function Line({classname} : {classname:string}){
return(
    <div className={`w-8  h-1 ${classname} flex-shrink-0`}></div>
)
}