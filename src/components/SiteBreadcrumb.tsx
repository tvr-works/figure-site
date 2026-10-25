import { Link } from '@tanstack/react-router';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

export function SiteBreadcrumb({ current, section }: { current: string; section?: { title: string; to: '/guides' } }) {
  return <Breadcrumb aria-label="Breadcrumb" className="mb-8">
    <BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink render={<Link to="/" />}>Figure</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      {section && <><BreadcrumbItem><BreadcrumbLink render={<Link to={section.to} />}>{section.title}</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /></>}
      <BreadcrumbItem><BreadcrumbPage>{current}</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>;
}
