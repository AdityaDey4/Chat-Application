import React from 'react'
import OtherUser from './OtherUser'

const OtherUsers = ({ users }) => {
  

  if (!users || users.length === 0) {
    return <p className="text-center text-white">No users found</p>;
  }

  return (
    <div>
      <div className='h-full overflow-y-auto pr-2  max-h-[400px]'>
            {
                users?.map((user)=>{
                    return (
                        <OtherUser key={user._id} user={user}/>
                    )
                })
            }
            
        </div>
    </div>
  )
}

export default OtherUsers