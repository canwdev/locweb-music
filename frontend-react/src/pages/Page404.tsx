import {Link} from 'react-router-dom'
import {Link as LinkMui} from '@mui/material'

const Page404 = () => {
  return (
    <div style={{textAlign: 'center'}}>
      404 Not Found.
      <LinkMui component={Link} to="/">
        Home
      </LinkMui>
    </div>
  )
}

export default Page404
