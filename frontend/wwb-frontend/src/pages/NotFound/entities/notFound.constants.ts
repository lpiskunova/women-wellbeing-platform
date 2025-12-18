import type { NotFoundCopy, NotFoundLinks } from './notFound.interfaces'

export const NOT_FOUND_LINKS: NotFoundLinks = {
  dataDictionary: '/discover',
  home: '/',
}

export const NOT_FOUND_COPY: NotFoundCopy = {
  title: 'Page not found',
  description:
    "We couldn't find this page. The link might be broken or the indicator doesn't exist.",
  backCta: 'Back to Data Dictionary',
  homeCta: 'Go to homepage',
}
