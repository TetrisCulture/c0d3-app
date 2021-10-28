import React from 'react'
import { ModalCard, ModalSize } from './ModalCard'
import NavLink from './NavLink'
import LogoutContainer from './LogoutContainer'

type ConnectToDiscordCardProps = {
  show: boolean
  hideable?: boolean
}

const discordConnectPage =
  'https://discord.com/api/oauth2/authorize?client_id=845470281283665970&redirect_uri=https%3A%2F%2Fc0d3.com%2Fapi%2Fauth%2Fcallback%2Fdiscord&response_type=code&scope=identify%20email%20guilds.join%20gdm.join'

const ConnectToDiscordCard: React.FC<ConnectToDiscordCardProps> = ({
  show
}) => {
  return (
    <ModalCard
      hideable={false}
      size={ModalSize.LARGE}
      close={() => {}}
      show={show}
    >
      <div className="m-5">
        <h3 className="text-center">Connect to Discord</h3>
        <div className="mt-3">
          <p>
            Please{' '}
            <a href={discordConnectPage} className="button">
              connect your Discord account
            </a>
            , or create one if you don&apos;t already have one. Our students and
            mentors use Discord to communicate and help each other, give you
            feedback on your challenges, and sometimes do virtual hangouts.
          </p>
          <p>
            If you don&apos;t want to connect to Discord, then you won&apos;t
            get any value out of creating an account on C0D3.com. Feel free to
            browse our lessons and study on your own!
          </p>
          <p>
            Also, if you would like to share your reasons for not using Discord,
            we&apos;d love to hear about it! Your thoughts will help us make
            more informed decisions about our community platform and if the
            reasons are compelling enough, may inspire us to switch to an
            alternative.
          </p>
        </div>
        <NavLink path={discordConnectPage}>
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block mb-3"
          >
            Connect Now
          </button>
        </NavLink>
        <LogoutContainer>
          <div className="text-center">
            <a href="#">No thanks, I&apos;ll study on my own.</a>
          </div>
        </LogoutContainer>
      </div>
    </ModalCard>
  )
}

export default ConnectToDiscordCard
