import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/button';

const UIPagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role='navigation'
    aria-label='pagination'
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
UIPagination.displayName = 'UIPagination';

const UIPaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  ),
);
UIPaginationContent.displayName = 'UIPaginationContent';

const UIPaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />,
);
UIPaginationItem.displayName = 'UIPaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;

const UIPaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className,
    )}
    {...props}
  />
);
UIPaginationLink.displayName = 'UIPaginationLink';

const UIPaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof UIPaginationLink>) => (
  <UIPaginationLink
    aria-label='Go to previous page'
    size='default'
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className='h-4 w-4' />
    <span>Previous</span>
  </UIPaginationLink>
);
UIPaginationPrevious.displayName = 'UIPaginationPrevious';

const UIPaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof UIPaginationLink>) => (
  <UIPaginationLink
    aria-label='Go to next page'
    size='default'
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className='h-4 w-4' />
  </UIPaginationLink>
);
UIPaginationNext.displayName = 'UIPaginationNext';

const UIPaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className='h-4 w-4' />
    <span className='sr-only'>More pages</span>
  </span>
);
UIPaginationEllipsis.displayName = 'UIPaginationEllipsis';

export {
  UIPagination,
  UIPaginationContent,
  UIPaginationEllipsis,
  UIPaginationItem,
  UIPaginationLink,
  UIPaginationNext,
  UIPaginationPrevious,
};
