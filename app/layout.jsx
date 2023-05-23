import Nav from '@/components/Nav'
import '../styles/globals.css'
import Provider from '@/components/Provider'


export const metadata = {
    title: "Raspberry Prompt",
    description: "Discover & Share AI Prompts"
}
const rootLayout = ({ children }) => {
    return (
        <html lang='en'>
            <body>
                <Provider>
                    <div className='main'>
                        <div className='gradient' />
                    </div>

                    <main className='app'>
                        <Nav />
                        {children}
                    </main>
                </Provider>
            </body>
        </html>
    )
}

export default rootLayout