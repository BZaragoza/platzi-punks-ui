import React from 'react'
import { useWeb3React } from '@web3-react/core';
import { Grid,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  FormHelperText,
  FormControl,
  useBoolean,
} from '@chakra-ui/react';
import { useState } from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import PunkCard from '../../components/punk-card';
import Loading from '../../components/loading';
import RequestAccess from '../../components/request-access';

import { usePlatziPunksData } from '../../hooks/usePlatziPunksData/index';

const Punks = () => {

  const { search } = useLocation();
  const navigate = useNavigate();
  const { library } = useWeb3React();
  const [address, setAddress] = useState(new URLSearchParams(search).get('address'));
  const [submitted, setSubmitted] = useBoolean(true);
  const [isValidAddress, setIsValidAddress] = useBoolean(true);
  const {active} = useWeb3React();
  const {punks, loading} = usePlatziPunksData({
    owner: submitted && isValidAddress 
      ? address 
      : null
  });

  console.log({address})

  const handleAddressChange = ({ target }) => { 
    setAddress(target.value);
    setSubmitted.off();
    setIsValidAddress.off();
  }

  const submit = (event) => { 
    event.preventDefault();

    if (address) {
      const isValid = library.utils.isAddress(address);
      
      if (isValid) {
        setSubmitted.on()
        setIsValidAddress.on()
        navigate(`/punks?address=${address}`)
      }
    } else {
      navigate("/punks");
    }
   }

  if (!active) return <RequestAccess />

  return (
    <>
      <form onSubmit={submit}>
        <FormControl>
          <InputGroup mb={3}>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />} 
            />
            <Input 
              isInvalid={false}
              value={address}
              onChange={handleAddressChange}
              placeholder="Buscar por dirección"
            />
            <InputRightElement width="5.5rem">
              <Button type='submit' height="1.75rem" size="sm">
                Buscar
              </Button>
            </InputRightElement>
          </InputGroup>
          {
            submitted && !isValidAddress && 
            <FormHelperText>Dirección inválida</FormHelperText>
          }
        </FormControl>
      </form>
      {
        loading
        ? <Loading /> :
        <Grid templateColumns={"repeat(auto-fill, minmax(250px, 1fr))"} gap={6}>
          {
            punks.map(({name, image, tokenId}) => (
              <Link to={`/punk/${tokenId}`} key={tokenId}>
                <PunkCard 
                  image={image}
                  name={name}
                />
              </Link>
            ))
          }
        </Grid>
      }
    </>
  )
}

export default Punks