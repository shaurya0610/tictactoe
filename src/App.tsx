import { ThemeProvider } from "@/components/theme-provider"
import './App.css'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Game from "./components/Game/Game"


function App() {
  return (

    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex min-h-dvh justify-center items-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Tic Tac Toe</CardTitle>
            {/* <CardDescription>Card Description</CardDescription> */}
          </CardHeader>
          <CardContent>
            {/* <p>Card Content</p> */}
            <div>
              <Game />
            </div>
          </CardContent>
          <CardFooter>
            {/* <p>Card Footer</p> */}
          </CardFooter>
        </Card>
      </div>
    </ThemeProvider>
  )
}

export default App
