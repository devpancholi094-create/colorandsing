import { forwardRef } from 'react';
import Icon from './Icon.jsx';

/** Big, labeled, touch-friendly button. variant: primary | soft | sun | mint | ghost | danger */
const Button = forwardRef(function Button(
  { variant = 'soft', size = 'md', icon, children, className = '', type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={`btn btn-${variant} btn-${size} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={size === 'lg' ? 30 : 24} />}
      <span>{children}</span>
    </button>
  );
});

export default Button;
