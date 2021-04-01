import {Link, useRoute} from 'wouter-preact'

const NavLink = props => {
  const [isActive] = useRoute(props.href)

  return (
    <Link {...props} >
      <a className={isActive ? 'active' : ''}>
        {props.children}
      </a>
    </Link>
  )
}

export {NavLink}
