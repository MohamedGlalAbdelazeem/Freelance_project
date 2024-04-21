import React from 'react'
import Header from './Header'
function Mainpage() {
  return (
     <main>
        <Header/>
          <section>
          <div className="hero min-h-screen" style={{backgroundImage: 'url(https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhbV0EEWOnATkDel8_R-jOSCXTUgCX7ZSv9_I2D0WnD_v-IpIOwDsZfYuMpqDoX-oxazCv-BgCUd-hcmrIld0CjTD3kFjsqo7O8eQiGO9RS3XYGbEdv6oXa1pfh_8PZ_8ZM3RiNLC6iOUw/s1600/aeroplane-HD.jpg)'}}>
            <div className="hero-overlay bg-opacity-65"></div>
            <div className="hero-content text-center text-neutral-content">
               <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold">أهلا بك 👋</h1>
                  <p className="mb-5"></p>
                  <button className="btn btn-primary">Get Started</button>
               </div>
            </div>
            </div>
          </section>
     </main>
  )
}

export default Mainpage