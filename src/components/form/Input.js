import React from 'react'

export default function Input({ label, placeholder, type, className, value, onChange }) {
  return (
    <div className="form-control w-[80%]">
        <label className="label">
            <span className="label-text font-semibold text-[#004f4f] text-base mb-2">{ label }</span>
        </label>
        <input type={ type } placeholder={ placeholder } className={`input input-bordered w-full bg-white text-[#6B7193] mb-[14px] rounded-md ${className}`} value={value} onChange={onChange} required/>
    </div>
  )
}
