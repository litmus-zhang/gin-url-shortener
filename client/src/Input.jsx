
export default function Input() {
  return (
    <div>
        <label>label</label>
        <input 
        type="text" 
        name="name"
        placeholder="placeholder"
        onChange={(e) => console.log(e.target.value)}
        autoComplete='on'/>
    </div>
  )
}
