import { Link } from '@tanstack/react-router';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';

export function GuideBreadcrumb({ title }: { title?: string }) {
  return <Breadcrumb aria-label="Breadcrumb" className="mb-8">
    <BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink render={<Link to="/" />}>Figure</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>{title ? <BreadcrumbLink render={<Link to="/guides" />}>Guides</BreadcrumbLink> : <BreadcrumbPage>Guides</BreadcrumbPage>}</BreadcrumbItem>
      {title && <><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{title}</BreadcrumbPage></BreadcrumbItem></>}
    </BreadcrumbList>
  </Breadcrumb>;
}
