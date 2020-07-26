import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
// import OnlineHandler from './onlineHandler';
import styles from '../styles/layout.module.scss';

const Layout = ({ children }) => {
  const router = useRouter()
  return (
    <div className={styles.container}>
      <div>
        <>{children}</>
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
